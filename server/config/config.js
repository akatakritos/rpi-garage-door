const os = require('os');
const path = require('path');

const root = path.join(__dirname, '..');

const defaults = {
    port: 300,
    root,
    pi: os.platform() === 'linux',
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
