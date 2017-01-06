const basicAuth = require('basic-auth');
const logger = require('../lib/logger').prefixed('auth');

// usage: app.use(httpBasicAuth('username', 'password))

module.exports = function(username, password) {


    return function basicAuthMiddleware(req, res, next) {

        function respondUnauthorized() {
            res.set('WWW-Authenticate', 'Basic realm=Authorization Required');
            res.send(401);
        }

        const user = basicAuth(req);

        if (!user) {
            return respondUnauthorized();

        } else if (user.name !== username || user.pass !== password) {
            logger.warn(`unauthorized login attempt for ${user.name}`);

            return respondUnauthorized();
        }

        return next();

    };

};

module.exports.header = function(user, password) {
    const b64 = new Buffer(`${user}:${password}`).toString('base64');
    return `Basic ${b64}`;
};
