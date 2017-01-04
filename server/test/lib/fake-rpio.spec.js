const expect = require('chai').expect;

const fakeRpio = require('../../app/lib/fake-rpio');
const doors = require('../../config/doors');

describe('FakeRPIO', () => {

    afterEach(() => fakeRpio.reset());

    describe('read and write', () => {

        it ('reads back an arbitrary pin that was wrote', () => {

            fakeRpio.write(42, 1);
            const result = fakeRpio.read(42);
            expect(result).to.equal(1);

        });

        it ('reads back a 0 for un written ports', () => {
            const result = fakeRpio.read(17);
            expect(result).to.equal(0);
        });

    });

    describe('triggering a fake snesor change', () => {

        it ('triggers a sensor change after a timeout', done => {

            fakeRpio.statusChangeTime = 10;
            const door = doors[0];

            fakeRpio.write(door.gpio.toggle, 1);
            fakeRpio.write(door.gpio.toggle, 0); // simulates sending the toggle command

            expect(fakeRpio.read(door.gpio.sensor)).to.equal(0);

            setTimeout(() => {

                expect(fakeRpio.read(door.gpio.sensor)).to.equal(1);

                done();

            }, 20);
        });

    });

});
