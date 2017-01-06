const path = require('path');
const fs = require('fs');

module.exports = function configureStaticGzipped(publicFolder) {

    return function tryStaticGzipped(req, res, next) {

        const gzipFile = `${req.url}.gz`;
        const diskPath = path.join(publicFolder, gzipFile);

        fs.exists(diskPath, exists => {

            if (exists) {
                req.url = gzipFile; // eslint-disable-line no-param-reassign
                res.set('Content-Encoding', 'gzip');
            }

            next();
        });
    };

};
