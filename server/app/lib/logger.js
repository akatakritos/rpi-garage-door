const winston = require('winston');
const config = require('../../config/config');

const transports = [];

if (config.env !== 'test') {
    transports.push(new winston.transports.Console({
        level: 'debug',
        json: false,
        colorize: config.env === 'development',  // color escape codes clutter production logs
        timestamp: config.env !== 'development', // want them in production but dont need in dev
    }));
}

module.exports = new winston.Logger({
    transports
});