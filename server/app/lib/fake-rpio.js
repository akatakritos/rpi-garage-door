// eslint-disable-file object-shorthand
const noop = () => {};
const logger = require('./logger');
const doors = require('../../config/doors');

const state = {

};

function simulateDoorSensorChange(door) {
    logger.info(`GPIO: Queueing door status change on Door "${door.name}"`);
    const current = state[door.gpio.sensor] ? 1 : 0;

    setTimeout(() => {
        state[door.gpio.sensor] = current ? 0 : 1;
        logger.info(`GPIO: Faked status change on door "${door.name}" to ${state[door.gpio.sensor]}`);
    }, 2500);

}

function getDoor(togglePin) {
    return doors.find(d => d.gpio.toggle === togglePin);
}


module.exports = {

    open(pin, state) {
        logger.debug(`GPIO: Open PIN${pin} as ${state}`);
    },

    write(pin, value) {
        logger.info(`GPIO: Write ${value} to PIN${pin}`);
        state[pin] = value;

        const door = getDoor(pin);
        if (door && value === 1) {
            simulateDoorSensorChange(door);
        }
    },

    read(pin) {
        const value = state[pin] ? 1 : 0;
        logger.debug(`GPIO: Read ${value} from PIN${pin}`);
        return value;
    },

    sleep: noop,
    msleep: noop,
    HIGH: 1,
    LOW: 0,
};
