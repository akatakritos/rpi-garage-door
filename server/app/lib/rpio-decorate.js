const logger = require('./logger').prefixed('gpio');

module.exports = function(rpio) {
    return {
        open(pin, state, initial) {
            const type = state === 1 ? 'output' : 'input';
            logger.debug(`open PIN-${pin} as ${type} initial: ${initial}`);
            return rpio.open(pin, state, initial);
        },

        pud(pin, pullup) {
            logger.debug(`configure PIN-${pin} as pullup ${pullup}`);
            return rpio.pud(pin, pullup);
        },

        write(pin, value) {
            logger.debug(`write ${value} to PIN-${pin}`);
            return rpio.write(pin, value);
        },

        read(pin) {
            const value = rpio.read(pin);
            logger.debug(`read ${value} from PIN-${pin}`);
            return value;
        },

        sleep(time) {
            logger.debug(`sleep for ${time} seconds`);
            return rpio.sleep(time);
        },

        msleep(time) {
            logger.debug(`sleep for ${time} miliseconds`);
            return rpio.msleep(time);
        },
    };

};
