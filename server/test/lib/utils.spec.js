const utils = require('../../app/lib/utils');
const expect = require('chai').expect;

describe('utils', () => {
    describe('#processStartDate', () => {

        it('should be the same for multiple invocations', done => {
            const firstInvocation = utils.processStartTime()
                .toISOString()
                .substring(0,22); // last digit might switch because of rounding errors

            setTimeout(() => {
                const secondInvocation = utils.processStartTime()
                    .toISOString()
                    .substring(0,22);

                expect(secondInvocation).to.equal(firstInvocation);
                done();
            }, 10);
        });
    });
});
