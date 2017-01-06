const express = require('express');
const router = express.Router();
const os = require('os');

const rpi = require('../lib/rpi-utils');
const logger = require('../lib/logger').prefixed('status route');

router.get('/status', (req, res, next) => {

    rpi.temperature()
        .then(celsius => {
            const result = {
                mem: os.freemem(),
                hostname: os.hostname(),
                loadavg: os.loadavg(),
                temp: celsius,
                totalMem: os.totalmem(),
                systemUptime: os.uptime(),
                serverUptime: process.uptime(),
                ips: rpi.ips(),
            };

            res.json(result);

        })
        .catch(err => {
            logger.error('problem getting statuses', err);
            next(err);
        });
});

module.exports = router;
