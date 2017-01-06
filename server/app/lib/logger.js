const winston = require('winston');
const config = require('../../config/config');
const path = require('path');

const logFolder = path.join(config.root, 'logs');

const transports = [];

if (config.env !== 'test') {
    transports.push(new winston.transports.Console({
        level: 'verbose',
        json: false,
        colorize: true,
        timestamp: false,
    }));
}

if (config.env === 'production') {
    transports.push(new winston.transports.DailyRotateFile({
        filename: path.join(logFolder, 'log'),
        datePattern: 'yyyy-MM-dd.',
        prepend: true,
        level: 'info',
        timestamp: true,
        colorize: false,
    }));
}

module.exports = new winston.Logger({
    transports,
});

module.exports.prefixed = function(prefix) {
    return new winston.Logger({
        transports,
        filters: [
            function(level, msg) {
                return `[${prefix}] ${msg}`;
            },
        ],
    });
};
