const express = require('express');
const router = express.Router();
const os = require('os');

const rpi = require('../lib/rpi-utils');

module.exports = function(app) {
    app.use('/api', router);
};

router.get('/status', function(req, res) {

    rpi.temperature()
        .then(celcius => {
            const result = {
                mem: os.freemem(),
                hostname: os.hostname(),
                loadavg: os.loadavg(),
                temp: celcius
            };

            res.json(result);

        })
        .catch(err => {
            res.err(err);
        });
});