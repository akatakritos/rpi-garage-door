const config = require('../../config/config');
const fs = require('fs');
const os = require('os');

const logger = require('./logger');

// http://raspberrypi.stackexchange.com/questions/357/how-do-i-monitor-and-or-control-the-temperature-of-the-soc
module.exports.temperature = function() {

    if (!config.pi) {
        return Promise.resolve(NaN);
    }

    return new Promise((resolve, reject) => {

        fs.readFile('/sys/class/thermal/thermal_zone0/temp', (err, data) => {
            if (err) {
                return reject(err);
            }

            logger.debug(`read raw "${data}"`);

            const milligrades = parseInt(data.toString().trim(), 10);
            resolve(milligrades / 1000);
        });

    });
};

module.exports.ips = function() {
    const results = [];

    const ifaces = os.networkInterfaces();
    Object.keys(ifaces).forEach(ifname => {
        let alias = 0;

        ifaces[ifname].forEach(iface => {
            if ('IPv4' !== iface.family || iface.internal !== false) {
                // skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
                return;
            }

            if (alias >= 1) {
                results.push({ name: `${ifname}:${alias}`, ip: iface.address });
            } else {
                results.push({ name: ifname, ip: iface.address });
            }
            ++alias;
        });
    });

    return results;
}
