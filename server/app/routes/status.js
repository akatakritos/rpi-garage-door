const express = require('express');
const router = express.Router();
const os = require('os');
const moment = require('moment-timezone');

const rpi = require('../lib/rpi-utils');
const config = require('../../config/config');
const logger = require('../lib/logger').prefixed('status route');

const FORMAT = 'YYYY-MM-DD HH:mm:ss';

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
                timezone: config.timezone,
                time: {
                    utc: moment.utc().format(FORMAT),
                    local : moment.tz(config.timezone).format(FORMAT),
                },
                environment: config.env,
                alerts: [
                    { name: 'Left Door Open at Night', enabled: config.sms.enabled },
                ],

            };

            res.json(result);

        })
        .catch(err => {
            logger.error('problem getting statuses', err);
            next(err);
        });
});

module.exports = router;
