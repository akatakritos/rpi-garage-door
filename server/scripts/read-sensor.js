const gateway = require('../app/lib/gpio-gateway');
const doors = require('../config/doors');
const config = require('../config/config');

const hw = config.pi ? require('rpio') : require('../app/lib/fake-rpio');

gateway.init(doors, hw);

function read() {
    gateway.isOpen(doors[0]).then(open => {
        console.log(open);
    });

    setTimeout(read, 1000);
}

read();
