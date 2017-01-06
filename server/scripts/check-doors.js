const doorChecker = require('../app/lib/open-door-checker');
const doors = require('../config/doors');
const config = require('../config/config');

const gpio = require('../app/lib/gpio-gateway');
const rp = config.pi ? require('rpio') : require('../app/lib/fake-rpio');
gpio.init(doors, rp);

doorChecker.check();
