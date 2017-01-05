const os = require('os');
const path = require('path');

require('dotenv').config({ silent: true });

const root = path.join(__dirname, '..');

const defaults = {
    port: 3000,
    root,
    pi: os.platform() === 'linux',
    auth: {
        type: process.env.AUTH_BASIC_USER && process.env.AUTH_BASIC_PASS ? 'http-basic' : null,
        user: process.env.AUTH_BASIC_USER,
        password: process.env.AUTH_BASIC_PASS,
    },
};

// override defaults if needed
const config = {
    development: {
        env: 'development',
    },
    test: {
        env: 'test',
    },
};


module.exports = Object.assign({}, defaults, config[process.env.NODE_ENV || 'development']);
