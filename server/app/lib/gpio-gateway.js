const EventEmitter = require('events').EventEmitter;
const logger = require('./logger');

let rpio;
let events;
let handle;
let doors;

function poll() {

    let last = {};

    const poller = () => {
        logger.debug('polling sensors');

        doors.forEach(door => {
            const value = rpio.read(door.gpio.sensor);

            if (value != last[door.name]) {

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
    };

    handle = setInterval(poller, module.exports.pollInterval);
}

module.exports.init = function(configuredDoors, rpioImpl) {
    rpio = rpioImpl;
    doors = configuredDoors;
    events = new EventEmitter();
};

module.exports.toggle = function(door) {

    return new Promise(resolve => {

        process.nextTick(() => {
            rpio.write(door.gpio.toggle, rpio.HIGH);
            rpio.msleep(20);
            rpio.write(door.gpio.toggle, rpio.LOW);

            resolve();
        });

    });
};


module.exports.subscribe = function(name, cb) {
    if (countListeners() === 0) {
        logger.info('starting polling');
        poll();
    }

    events.on(name, cb);
    return { __cb: cb };
};

module.exports.unsubscribe = function(name, handle) {

    events.removeListener(name, handle.__cb);

    if (countListeners() === 0) {
        logger.info('stopped polling');
        clearInterval(handle);
    }
};

function countListeners() {
    return events.listenerCount('opened') +
        events.listenerCount('closed');
}

module.exports.pollInterval = 100;
