const cron = require('cron');

const SmsApi = require('./sms');
const rpi = require('./gpio-gateway');
const logger = require('./logger').prefixed('door check');

const config = require('../../config/config');
const doors = require('../../config/doors');


module.exports.check = function check() {
    logger.info('starting check');

    doors.forEach(door => {
        logger.info(`checking ${door.name}`);

        rpi.isOpen(door).then(open => {
            if (open) {
                logger.warn(`Door ${door.name} is still open!`);

                const client = SmsApi.create();
                client.alert(`door ${door.name} is still open!`).then(() => {
                    logger.info('sent alert');
                })
                .catch(err => {
                    logger.error('error sending alert', err);
                });
            }
        });
    });
};

module.exports.finished = function() {
    logger.info('completed checks');
};

module.exports.setup = function() {
    logger.info(`installing cron job "${config.alertSchedule}"`);
    new cron.CronJob(config.alertSchedule, module.exports.check, module.exports.finished, true, config.timezone);
};
