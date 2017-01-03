const express = require('express');
const bodyParser = require('body-parser');
const expressWinston = require('express-winston');
const path = require('path');
const glob = require('glob');
const fs = require('fs');
const http = require('http');

const logger = require('./app/lib/logger');
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

function tryStaticGzipped(req, res, next) {

     // eslint-disable-next-line prefer-template
    const gzipFile = `${req.url}.gz`;
    const diskPath = path.join(config.root, 'public', gzipFile);

    fs.exists(diskPath, exists => {

        if (exists) {
            req.url = gzipFile; // eslint-disable-line no-param-reassign
            res.set('Content-Encoding', 'gzip');
        }

        next();
    });

}

app.get('*.bundle.js', tryStaticGzipped);

app.use(express.static(path.join(config.root, 'public')));

const routes = glob.sync(path.join(config.root, 'app', 'routes', '*.js'))
    .map(c => require(c));
app.use('/api', routes);


const indexFile = path.join(config.root, 'public', 'index.html');
app.use((req, res) => {
    res.status(200).sendFile(indexFile);
});

if (config.env === 'development') {
    app.use((err, req, res) => {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err,
            title: 'error',
        });
    });
}

app.use((err, req, res) => {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {},
        title: 'error',
    });
});

const server = http.createServer(app);
require('./app/lib/websockets')(server);


server.listen(config.port, () => {
    logger.info(`Express listening on ${config.port}.`);
});
