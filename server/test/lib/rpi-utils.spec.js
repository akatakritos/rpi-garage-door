const expect = require('chai').expect;
const td = require('testdouble');
const fs = require('fs');

const config = require('../../config/config');
const rpi = require('../../app/lib/rpi-utils');

describe('rpi-utils', () => {
    afterEach(() => td.reset());

    describe('#temperature', () => {
        let before;
        beforeEach(() => before = config.pi);
        afterEach(() => config.pi = before);

        describe('windows', () => {

            beforeEach(() => config.pi = false);

            it('returns resolved promise for NaN', () => {

                return rpi.temperature().then(temp => {
                    expect(isNaN(temp)).to.be.true;
                });

            });
        });

        describe('linux', () => {
            beforeEach(() => config.pi = true);

            it('reads and converts to celcius', () => {
                td.replace(fs, 'readFile');
                td.when(fs.readFile('/sys/class/thermal/thermal_zone0/temp'))
                    .thenCallback(null, '39000\n');

                return rpi.temperature().then(temp => {
                    expect(temp).to.equal(39);
                });

            });

            it ('converts an error into a rejected promise', () => {
                td.replace(fs, 'readFile');
                td.when(fs.readFile(td.matchers.anything()))
                    .thenCallback(new Error(), null);

                return rpi.temperature().catch(err => {
                    expect(err).to.be.instanceOf(Error);
                });
            });
        });
    });
});
