const os = require('os');
const path = require('path');

const root = path.join(__dirname, '..');

const config = {
    development: {
        env: 'development',
        port: 3000,
        root,
        pi: os.platform() === 'linux'
    }
};


module.exports = config[process.env.NODE_ENV || 'development'];
