const gpio = require('../gpio-gateway');
const logger = require('../logger').prefixed('vacation-mode');
const SmsApi = require('../sms');

class VacationMode {

    constructor() {
        this.name = 'Vacation Mode';

        this.handles = {};
        this.client = null;
    }


    enable() {
        this.client = SmsApi.create();

        ['opened', 'closed'].forEach(eventName => {

            const handle = gpio.subscribe(eventName, door => {
                logger.info(`alerting "${door.name}" has ${eventName}`);
                this.client.alert(`Warning! Door "${door.name}" has ${eventName}!`);
            });

            this.handles[eventName] = handle;

        });

        logger.info('enabled');
        return Promise.resolve();
    }

    disable() {

        Object.keys(this.handles).forEach(k => {
            gpio.unsubscribe(k, this.handles[k]);
            delete this.handles[k];
        });

        logger.info('disabled');
        return Promise.resolve();
    }
}

module.exports = VacationMode;
