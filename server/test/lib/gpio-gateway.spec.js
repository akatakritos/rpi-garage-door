const gateway = require('../../app/lib/gpio-gateway');
const FakeRpio = require('../../app/lib/fake-rpio');
const expect = require('chai').expect;

const td = require('testdouble');

const doors = [
    {
        name: 'Door 1',
        gpio: {
            toggle: 1,
            sensor: 2,
        },
    },
    {
        name: 'Door 2',
        gpio: {
            toggle: 3,
            sensor: 4,
        },
    },
];

// for faster tests
gateway.pollInterval = 1;

describe('GPIO Controller', () => {
    let rpio;
    beforeEach(() => rpio = td.object(FakeRpio));

    describe('toggle', () => {

        it('turns high, sleeps, then turns low', () => {

            gateway.init(doors, rpio);

            return gateway.toggle(doors[0]).then(() => {
                td.verify(rpio.write(1, 1));
                td.verify(rpio.msleep(20));
                td.verify(rpio.write(1, 0));
            });
        });
    });

    describe('sensor events', () => {
        it('gets a door opened event when pin goes high', done => {

            gateway.init(doors, rpio);

            td.when(rpio.read(4)).thenReturn(0,0,1);

            const handle = gateway.subscribe('opened', door => {
                expect(door.name).to.equal('Door 2');
                gateway.unsubscribe('opened', handle);

                done();
            });

        });

        it ('gets a door closed event when pin goes low', done => {

            gateway.init(doors, rpio);

            td.when(rpio.read(2)).thenReturn(1,1,0);

            const handle = gateway.subscribe('opened', door => {
                expect(door.name).to.equal('Door 1');
                gateway.unsubscribe('opened', handle);

                done();
            });

        });
    });
});
