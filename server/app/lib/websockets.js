const gpio = require('./gpio-gateway');
const logger = require('./logger').prefixed('websockets');
const eventLog = require('./door-log');

module.exports = function(io) {

    ['opened', 'closed'].forEach(eventName => {

        gpio.subscribe(eventName, door => {
            logger.verbose(`notifying "${door.name}" has ${eventName}`);

            const event = eventLog.add(door, eventName);
            io.emit(`door:${eventName}`, event);
        });

    });

};
