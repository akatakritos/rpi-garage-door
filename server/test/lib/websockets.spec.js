const configure = require('../../app/lib/websockets');
const gpio = require('../../app/lib/gpio-gateway');
const td = require('testdouble');
const EventEmitter = require('events').EventEmitter;
const doors = require('../../config/doors');

class FakeGpio {
    constructor() {
        this.eventEmitter = new EventEmitter();
    }

    subscribe(eventName, cb) {
        this.eventEmitter.on(eventName, cb);
    }

    emit(eventName, door) {
        this.eventEmitter.emit(eventName, door);
    }
}


describe('websockets', () => {
    afterEach(() => td.reset());

    describe('listening', () => {

        ['opened', 'closed'].forEach(eventName => {
            it(`hears the ${eventName} event`, () => {

                const fakeGpio = new FakeGpio();

                td.replace(gpio, 'subscribe');
                td.when(gpio.subscribe(eventName, td.matchers.isA(Function)))
                    .thenDo((e, f) => fakeGpio.subscribe(e, f));

                const io = {
                    emit: td.function(),
                };

                configure(io);

                fakeGpio.emit(eventName, doors[0]);

                td.verify(io.emit(eventName,
                    td.matchers.argThat(a =>
                        a.id === doors[0].id && a.name === doors[0].name && a.eventName === eventName)
                ));
            });

        });

    });
});
