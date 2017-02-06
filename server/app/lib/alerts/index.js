const fs = require('fs');
const path = require('path');

const VacationMode = require('./vacation-mode');
const OpenDoorChecker = require('./open-door-checker');
const config = require('../../../config/config');
const logger = require('../logger').prefixed('alerts');

const modules = {
    'vacation-mode': new VacationMode(),
    'open-door': new OpenDoorChecker(),
};

const dataFile = path.join(config.root, 'data', 'alerts.json');
logger.debug(`data file: ${dataFile}`);

let alertDataPromise;

function createDefault() {
    return Object.keys(modules).map(id => {
        return {
            id,
            enabled: false,
            name: modules[id].name,
        };
    });
}

function loadAlertStatus() {
    return new Promise((resolve, reject) => {
        fs.exists(dataFile, exists => {
            if (!exists) {
                logger.warn('data file not found');
                return resolve(createDefault());
            }

            fs.readFile(dataFile, 'utf8', (err, contents) => {
                if (err) { return reject(err); }

                const data = JSON.parse(contents);
                const result = createDefault();

                data.forEach(alertData => {
                    const alert = result.find(a => a.id === alertData.id);
                    Object.assign(alert, alertData);
                });

                logger.verbose('loaded alert data');
                return resolve(result);
            });

        });
    });
}

/**
 * Gets a promise for the alert data
 *
 * @return {Promise<Alert[]>}
 */
function getAlerts() {
    if (!alertDataPromise) {
        alertDataPromise = loadAlertStatus();
    }

    return alertDataPromise;
}

function getAlert(id) {
    return getAlerts()
        .then(alerts => {
            const alert = alerts.find(a => a.id === id);
            if (!alert) {
                throw new Error(`Could not find an alert called ${id}`);
            }

            return alert;
        });
}

function ensureDataDir(cb) {
    const dataDir = path.dirname(dataFile);
    fs.exists(dataDir, exists => {
        if (exists) {
            return cb(null);
        }

        fs.mkdir(dataDir, cb);
    });
}

function persist() {
    return new Promise((resolve, reject) => {
        ensureDataDir(err => {
            if (err) {
                return reject(err);
            }

            getAlerts()
                .then(alerts => {
                    fs.writeFile(dataFile, JSON.stringify(alerts), { encoding: 'utf8' }, err => {
                        if (err) {
                            return reject(err);
                        }

                        logger.verbose('persisted to disk');
                        return resolve();
                    });
                });

        });
    });
}

function enable(id) {
    if (!modules[id]) {
        throw new Error(`No alert with id "${id}"`);
    }

    return modules[id].enable()
        .then(() => getAlert(id))
        .then(alert => {
            alert.enabled = true; // eslint-disable-line no-param-reassign
        })
        .then(persist);
}

function disable(id) {
    if (!modules[id]) {
        throw new Error(`No alert with id "${id}"`);
    }

    return modules[id].disable()
        .then(() => getAlert(id))
        .then(alert => {
            alert.enabled = false; // eslint-disable-line no-param-reassign
        })
        .then(persist);
}

function init() {
    return getAlerts()
        .then(alerts => {
            const promises = alerts.filter(a => a.enabled)
                .map(a => modules[a.id].enable());

            return Promise.all(promises);
        });
}

module.exports = {
    enable,
    disable,
    init,
    getAlerts,
};
