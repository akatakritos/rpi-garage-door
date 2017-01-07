const gateway = require('../app/lib/gpio-gateway');
const doors = require('../config/doors');
const config = require('../config/config');
const logger = require('../app/lib/logger');

const hw = config.pi ? require('rpio') : require('../app/lib/fake-rpio');

gateway.init(doors, hw);

function toggle() {
    gateway.toggle(doors[0]);
    setTimeout(toggle, 3000);
}

toggle();
