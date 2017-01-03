const express = require('express');
const router = express.Router();
const os = require('os');

const rpi = require('../lib/rpi-utils');

router.get('/status', (req, res) => {

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
            res.err(err);
        });
});

module.exports = router;
