const config = require('../../config/config');
const fs = require('fs');

const logger = require('./logger');

// http://raspberrypi.stackexchange.com/questions/357/how-do-i-monitor-and-or-control-the-temperature-of-the-soc
module.exports.temperature = function() {

    if (!config.pi) {
        return Promise.resolve(NaN);
    }

    return new Promise((resolve, reject) => {

        fs.readFile('/sys/class/thermal/thermal_zone0/temp', (err, data) => {
            if (err) return reject(err);

            const milligrades = parseInt(data);
            logger.debug(`read raw "${data}"`);
            logger.debug(milligrades);
            logger.debug(milligrades/1000);
            resolve(milligrades / 1000);
        });

    });
};