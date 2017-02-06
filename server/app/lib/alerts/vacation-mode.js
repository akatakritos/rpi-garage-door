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
        if (this.handles.opened || this.handles.closed) {
            logger.warn('already enabled');
            return Promise.resolve();
        }

        this.client = SmsApi.create();

        ['opened', 'closed'].forEach(eventName => {

            const handle = gpio.subscribe(eventName, door => {
                logger.info(`alerting "${door.name}" has ${eventName}`);
                const message = eventName === 'opened' ?
                    `Warning! Door "${door.name}" has opened!` :
                    `It's OK. Door "${door.name}" is closed now.`;

                this.client.alert(message);
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
