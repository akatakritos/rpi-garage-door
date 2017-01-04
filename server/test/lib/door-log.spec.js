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

        it('can filter the logs by a predicate', () => {
            const logIds = doorLog.recent(3, l => l.id % 2 === 0)
                .map(l => l.id);
            expect(logIds).to.eql([8, 6, 4]);
        });
    });

    describe('#last', () => {
        beforeEach(() => {
            for (let i = 0; i < 10; i++) {
                doorLog.add({ id: i, name: `Door ${i}` }, 'opened');
            }
        });

        it('gets the most recent with no params', () => {
            const result = doorLog.last();
            expect(result.id).to.equal(9);
        });

        it ('gets the most recent matching the predicate', () => {

            const result = doorLog.last(e => e.id % 2 === 0);
            expect(result.id).to.equal(8);
        });

        it ('returns a falsy if the log is empty', () => {
            doorLog.clear();
            const result = doorLog.last();
            expect(result).not.to.be.ok;
        });

        it ('returns a falsey if the log has nothing matching the predicate', () => {
            const result = doorLog.last(e => e.id === 'foobar');
            expect(result).to.not.be.ok;
        });

    });
});
