const utils = require('../../app/lib/utils');
const expect = require('chai').expect;

describe('utils', () => {
    describe('#processStartDate', () => {

        it('should be the same for multiple invocations', done => {
            const firstInvocation = utils.processStartTime().toISOString();

            setTimeout(() => {
                const secondInvocation = utils.processStartTime().toISOString();

                expect(secondInvocation).to.equal(firstInvocation);
                done();
            }, 10);
        });
    });
});
