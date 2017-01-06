// eslint-disable-file object-shorthand
const noop = () => {};
const logger = require('./logger').prefixed('fake gpio');
const doors = require('../../config/doors');

let state = {

};

function simulateDoorSensorChange(door, timeout) {
    logger.info(`queueing door status change on Door "${door.name}"`);
    const current = state[door.gpio.sensor] ? 1 : 0;

    setTimeout(() => {
        state[door.gpio.sensor] = current ? 0 : 1;
        logger.info(`faked status change on door "${door.name}" to ${state[door.gpio.sensor]}`);
    }, timeout);

}

function getDoor(togglePin) {
    return doors.find(d => d.gpio.toggle === togglePin);
}


module.exports = {

    open: noop,

    write(pin, value) {
        state[pin] = value;

        const door = getDoor(pin);
        if (door && value === 1) {
            simulateDoorSensorChange(door, this.statusChangeTime);
        }
    },

    read(pin) {
        return state[pin] ? 1 : 0;
    },

    reset() {
        state = {};
    },

    sleep: noop,
    msleep: noop,
    statusChangeTime : 2500,
};


