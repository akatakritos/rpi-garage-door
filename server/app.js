const express = require('express');
const bodyParser = require('body-parser');
const expressWinston = require('express-winston');
const path = require('path');
const glob = require('glob');
const http = require('http');

const logger = require('./app/lib/logger').prefixed('app');
const config = require('./config/config');

const app = express();

const gpio = require('./app/lib/gpio-gateway');
const doors = require('./config/doors');
const hw = config.pi ? require('rpio') : require('./app/lib/fake-rpio');

gpio.init(doors, hw);

app.use(expressWinston.logger({
    winstonInstance: logger,
}));

app.use(bodyParser.json());

const routes = glob.sync(path.join(config.root, 'app', 'routes', '*.js'))
    .map(c => require(c));
app.use('/api', routes);



app.use(expressWinston.errorLogger({
    winstonInstance: logger,
}));

app.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
    logger.error(err.message);
    res.status(err.status || 500);
    res.json({
        message: err.message,
        error: err,
    });
});

const server = http.createServer(app);
const io = require('socket.io')(server);
require('./app/lib/websockets')(io);


server.listen(config.port, () => {
    logger.info(`Express listening on ${config.port}.`);
    logger.info(`Running in the ${config.env} environment`);
});

const checker = require('./app/lib/open-door-checker');
const vacationMode = require('./app/lib/vacation-mode');
if (config.sms.enabled) {
    checker.setup();
    vacationMode.enable();
}
