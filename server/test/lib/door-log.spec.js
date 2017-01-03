const expect = require('chai').expect;

const doorLog = require('../../app/lib/door-log');

describe('EventLog', () => {
    afterEach(() => doorLog.clear());

    describe('#recent', () => {
        beforeEach(() => {
            for (let i = 0; i < 10; i++) {
                doorLog.add({ id: i, name: `Door ${i}` }, 'opened');
            }
        });

        it('gets 5 logs by default', () => {
            const logs = doorLog.recent();
            expect(logs).to.have.lengthOf(5);
        });

        it ('gets a configurable number', () => {
            const logs = doorLog.recent(3);
            expect(logs).to.have.lengthOf(3);
        });

        it('gets the most recent ones in reverse order', () => {
            const logIds = doorLog.recent(3).map(l => l.id);
            expect(logIds).to.eql([9, 8, 7]);
        });

        it('can filter the logs', () => {
            const logIds = doorLog.recent(3, l => l.id % 2 === 0)
                .map(l => l.id);
            expect(logIds).to.eql([8, 6, 4]);
        });
    });
});
