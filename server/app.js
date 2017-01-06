const express = require('express');
const bodyParser = require('body-parser');
const expressWinston = require('express-winston');
const path = require('path');
const glob = require('glob');
const http = require('http');
const httpBasicAuth = require('./app/middleware/http-basic-auth');
const tryStaticGzipped = require('./app/middleware/try-static-gzipped');

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

if (config.auth.type === 'http-basic') {
    logger.info(`Enabling HTTP Basic Auth for ${config.auth.user}`);
    app.use(httpBasicAuth(config.auth.user, config.auth.password));
}


const publicPath = path.join(config.root, 'public');

app.get('*.bundle.js', tryStaticGzipped(path.join(publicPath)));
app.use(express.static(publicPath));

const routes = glob.sync(path.join(config.root, 'app', 'routes', '*.js'))
    .map(c => require(c));
app.use('/api', routes);



app.use(expressWinston.errorLogger({
    winstonInstance: logger,
}));

app.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
    res.status(err.status || 500);
    res.json({
        message: err.message,
        error: {},
        title: 'error',
    });
});

// angular routes
const indexFile = path.join(config.root, 'public', 'index.html');
app.use((req, res) => {
    res.status(200).sendFile(indexFile);
});

const server = http.createServer(app);
const io = require('socket.io')(server);
require('./app/lib/websockets')(io);


server.listen(config.port, () => {
    logger.info(`Express listening on ${config.port}.`);
});

const checker = require('./app/lib/open-door-checker');
if (config.sms.enabled) {
    checker.setup();
}
