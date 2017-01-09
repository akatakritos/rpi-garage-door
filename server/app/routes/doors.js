const router = require('express').Router();
const doors = require('../../config/doors');
const gpio = require('../lib/gpio-gateway');
const _ = require('lodash');
const doorLog = require('../lib/door-log');
const utils = require('../lib/utils');
const logger = require('../lib/logger').prefixed('doors router');

router.get('/doors', (req, res, next) => {

    Promise.all(doors.map(gpio.isOpen)).then(states => {
        const result = _.zip(doors, states).map(combined => {
            const id = combined[0].id;

            return {
                name: combined[0].name,
                id,
                open: combined[1],
                lastChange: _.get(doorLog.last(e => e.id === id), 'timestamp', utils.processStartTime()),
            };
        });

        res.json(result);
    })
    .catch(err => {
        logger.error('error reading doors', err);
        return next(err);
    });

});

router.post('/doors/:id/toggle', (req, res, next) => {
    const door = doors.find(d => d.id === Number(req.params.id));
    if (!door) {
        return res.status(404).send();
    }

    gpio.toggle(door).then(() => {
        res.status(200).send();
    })
    .catch(err => {
        logger.error(`error toggling door ${door.name}`, err);
        next(err);
    });

});

router.get('/doors/logs', (req, res) => {
    const logs = doorLog.recent(10);
    res.json(logs);
});

module.exports = router;
