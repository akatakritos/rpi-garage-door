const EventEmitter = require('events').EventEmitter;
const logger = require('./logger').prefixed('gateway');
const decorate = require('./rpio-decorate');

let rpio;
let events;
let doors;
let pollHandle;
const HIGH = 1;
const LOW = 0;
const INPUT = 0x0;
const OUTPUT = 0x1;
const PULL_OFF = 0x0;
const PULL_DOWN = 0x1;
const PULL_UP = 0x2;

function listenerCount() {
    return events.listenerCount('opened') +
        events.listenerCount('closed');
}

function poll() {
    const last = {};

    const poller = () => {
        logger.debug('polling sensors');

        doors.forEach(door => {
            module.exports.isOpen(door).then(value => {

                if (value !== last[door.name]) {

                    if (value) {

                        logger.info('door opened', door);
                        events.emit('opened', door);

                    } else {

                        logger.info('door closed', door);
                        events.emit('closed', door);
                    }
                }

                last[door.name] = value;
            });
        });
    };

    pollHandle = setInterval(poller, module.exports.pollInterval);
}

module.exports.init = function(configuredDoors, rpioImpl) {
    logger.info('initializing connections to gpio');

    rpio = decorate(rpioImpl);
    doors = configuredDoors;
    events = new EventEmitter();

    doors.forEach(door => {
        rpio.open(door.gpio.toggle, OUTPUT, HIGH);
        rpio.pud(door.gpio.sensor, PULL_DOWN);
        rpio.open(door.gpio.sensor, INPUT);
    });
};

module.exports.toggle = function(door) {

    return new Promise(resolve => {

        process.nextTick(() => {
            rpio.write(door.gpio.toggle, LOW);
            rpio.msleep(20);
            rpio.write(door.gpio.toggle, HIGH);

            resolve();
        });

    });
};

module.exports.isOpen = function(door) {

    return new Promise(resolve => {

        process.nextTick(() => {
            const value = rpio.read(door.gpio.sensor);
            resolve(value === LOW);
        });

    });

};


module.exports.subscribe = function(name, cb) {

    if (listenerCount() === 0) {
        logger.info('starting polling');
        poll();
    }

    events.on(name, cb);
    return { __cb: cb };
};

module.exports.unsubscribe = function(name, handle) {

    events.removeListener(name, handle.__cb);

    if (listenerCount() === 0) {
        logger.info('stopped polling');
        clearInterval(pollHandle);
    }
};

module.exports.pollInterval = 1000;

