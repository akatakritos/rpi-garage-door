const cron = require('cron');

const SmsApi = require('./sms');
const rpi = require('./gpio-gateway');
const logger = require('./logger');

const config = require('../../config/config');
const doors = require('../../config/doors');


module.exports.check = function check() {
    logger.info('Starting checks');

    doors.forEach(door => {
        logger.info(`Scheduled check of ${door.name}`);

        rpi.isOpen(door).then(open => {
            if (open) {
                logger.info(`Door ${door.name} is still open!`);

                const client = SmsApi.create();
                client.alert(`Door ${door.name} is still open!`).then(() => {
                    logger.info('Sent alert');
                })
                .catch(err => {
                    logger.error('Error sending alert', err);
                });
            }
        });
    });
};

module.exports.finished = function() {
    logger.info('Completed checks');
};

module.exports.setup = function() {
    logger.info(`Installing door check cron job "${config.alertSchedule}"`);
    new cron.CronJob(config.alertSchedule, module.exports.check, module.exports.finished, true, config.timezone);
};
