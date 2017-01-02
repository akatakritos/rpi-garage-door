const express = require('express');
const router = express.Router();
const os = require('os');

const rpi = require('../lib/rpi-utils');

module.exports = function (app) {
    app.use('/api', router);
};

function ips() {
    const results = [];

    const ifaces = os.networkInterfaces();
    Object.keys(ifaces).forEach(function (ifname) {
        var alias = 0;

        ifaces[ifname].forEach(function (iface) {
            if ('IPv4' !== iface.family || iface.internal !== false) {
                // skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
                return;
            }

            if (alias >= 1) {
                results.push({ name: ifname + ':' + alias, ip: iface.address});
            } else {
                results.push({ name: ifname, ip: iface.address });
            }
            ++alias;
        });
    });

    return results;s
}

router.get('/status', function (req, res) {

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
                ips: ips(),
            };

            res.json(result);

        })
        .catch(err => {
            res.err(err);
        });
});