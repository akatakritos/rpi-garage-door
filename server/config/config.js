const os = require('os');
const path = require('path');

require('dotenv').config({ silent: true });

const root = path.join(__dirname, '..');

const defaults = {
    port: 3000,
    root,
    pi: os.platform() === 'linux',
    timezone: 'America/Chicago',
    auth: {
        type: process.env.AUTH_BASIC_USER && process.env.AUTH_BASIC_PASS ? 'http-basic' : null,
        user: process.env.AUTH_BASIC_USER,
        password: process.env.AUTH_BASIC_PASS,
    },
    sms: {
        enabled: ['TWILIO_NUMBER', 'TWILIO_AUTH_TOKEN', 'TWILIO_ACCOUNT_SID'].every(k => process.env[k]),
        from: process.env.TWILIO_NUMBER,
        authToken: process.env.TWILIO_AUTH_TOKEN,
        accountSid: process.env.TWILIO_ACCOUNT_SID,
        to: process.env.ALERT_PHONE,
    },
    alertSchedule: '0 22 * * *',
};

// override defaults if needed
const config = {
    development: {
        env: 'development',
    },
    test: {
        env: 'test',
        sms: {
            enabled: true,
            from: '5551234567',
            authToken: 'ABCDEF',
            accountSid: 'FEDCBA',
            to: '5558675309',
        },
    },
    production: {
        env: 'production',
    },
};


module.exports = Object.assign({}, defaults, config[process.env.NODE_ENV || 'development']);
