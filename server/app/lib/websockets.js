const gpio = require('./gpio-gateway');
const logger = require('./logger');
const eventLog = require('./door-log');

module.exports = function(io) {

    ['opened', 'closed'].forEach(eventName => {

        gpio.subscribe(eventName, door => {
            logger.info(`Notifying sockets that "${door.name}" has ${eventName}`);

            const event = eventLog.add(door, eventName);
            io.emit(eventName, event);
        });

    });

};
