const expect = require('chai').expect;
const td = require('testdouble');
const SmsClient = require('../../app/lib/sms');

describe('sms', () => {
    let twilio;

    beforeEach(() => {
        twilio = {
            messages: {
                create: td.function(),
            },
        };
    });

    it('uses the twilio api and returns a successful promise', () => {
        td.when(twilio.messages.create(td.matchers.anything()))
            .thenCallback(null, 'success');

        const subject = new SmsClient(twilio);

        return subject.alert('Door is still open!').then(() => {

            td.verify(twilio.messages.create({
                body: 'Door is still open!',
                to: '5558675309',
                from: '5551234567',
            }, td.matchers.anything()));

        });
    });

    it('turns a failure into a rejected promise', () =>{
        td.when(twilio.messages.create(td.matchers.anything()))
            .thenCallback(new Error('foo'), null);

        const subject = new SmsClient(twilio);

        return subject.alert('This should error').catch(err => {
            expect(err).to.be.instanceof(Error);
        });
    });
});
