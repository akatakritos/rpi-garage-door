const gpio = require('./gpio-gateway');
const logger = require('./logger');

module.exports = function(app) {
    const io = require('socket.io')(app);

    gpio.subscribe('opened', door => {
        logger.info(`Notifying sockets that "${door.name}" has opened.`);
        io.emit('opened', { id:door.id });
    });

    gpio.subscribe('closed', door => {
        logger.info(`Notifying sockets that "${door.name}" has closed.`);
        io.emit('closed', { id: door.id });
    });
};
