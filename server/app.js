const express = require('express');
const bodyParser = require('body-parser');
const expressWinston = require('express-winston');
const path = require('path');
const glob = require('glob');

const logger = require('./app/lib/logger');
const config = require('./config/config');

var app = express();

app.use(expressWinston.logger({
    winstonInstance: logger
}));

app.use(bodyParser.json());
app.use(express.static(path.join(config.root, 'public')));

const controllers = glob.sync(path.join(config.root, 'app', 'routes', '*.js'));
controllers.forEach(function (controller) {
    require(controller)(app);
});

app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

if (config.env === 'development') {
    app.use(function (err, req, res) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err,
            title: 'error'
        });
    });
}

app.use(function (err, req, res) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {},
        title: 'error'
    });
});

app.listen(config.port, () => {
    logger.info(`Express listening on ${config.port}.`);

});