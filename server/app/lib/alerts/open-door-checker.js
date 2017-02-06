const cron = require('cron');

const SmsApi = require('../sms');
const rpi = require('../gpio-gateway');
const logger = require('../logger').prefixed('door check');

const config = require('../../../config/config');
const doors = require('../../../config/doors');

class OpenDoorAlert {
    constructor() {
        this.name = 'Open Door';

        const startImmediately = false;
        this.job = new cron.CronJob(config.alertSchedule,
            this.check.bind(this), this.finished.bind(this),
            startImmediately, config.timezone);
    }

    enable() {
        logger.info(`enabling cron job "${config.alertSchedule}"`);
        this.job.start();
        return Promise.resolve();
    }

    check() {
        logger.info('starting check');

        doors.forEach(door => {
            logger.info(`checking ${door.name}`);

            rpi.isOpen(door).then(open => {
                if (open) {
                    logger.warn(`Door ${door.name} is still open!`);

                    const client = SmsApi.create();
                    client.alert(`door ${door.name} is still open!`)
                        .then(() => {
                            logger.info('sent alert');
                        })
                        .catch(err => {
                            logger.error('error sending alert', err);
                        });
                }
            });
        });
    }

    finished() {
        logger.info('completed checks');
    }

    disable() {
        this.job.stop();
        logger.info('job stopped');

        return Promise.resolve();
    }
}

module.exports = OpenDoorAlert;
