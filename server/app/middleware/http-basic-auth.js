const basicAuth = require('basic-auth');

// app.use(httpBasicAuth('username', 'password))

module.exports = function(username, password) {


    return function basicAuthMiddleware(req, res, next) {

        const user = basicAuth(req);

        if (!user || user.name !== username || user.pass !== password) {
            res.set('WWW-Authenticate', 'Basic realm=Authorization Required');
            res.send(401);
            return;
        }

        return next();

    };

};

module.exports.header = function(user, password) {
    const b64 = new Buffer(`${user}:${password}`).toString('base64');
    return `Basic ${b64}`;
};
