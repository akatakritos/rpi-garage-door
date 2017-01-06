const config = require('../../config/config');
const twilio = require('twilio');
const logger = require('./logger').prefixed('sms');

class SmsClient {

    constructor(twilioClient) {
        this.client = twilioClient;
    }

    alert(message) {
        return new Promise((resolve, reject) => {
            logger.verbose('sending SMS to twilio');

            this.client.messages.create({
                body: message,
                to: config.sms.to,
                from: config.sms.from,
            }, (err, result) => {
                if (err) {
                    return reject(err);
                }

                return resolve(result);
            });
        });
    }

    static create() {
        const client = twilio(config.sms.accountSid, config.sms.authToken);
        return new SmsClient(client);
    }

}

module.exports = SmsClient;

