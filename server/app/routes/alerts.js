const router = require('express').Router();
const logger = require('../lib/logger').prefixed('alerts router');
const Alerts = require('../lib/alerts');

router.get('/alerts', (req, res, next) => {
    Alerts.getAlerts()
        .then(alerts => {
            return res.json(alerts);
        })
        .catch(err => {
            logger.error('problem loading alerts', err);
            next(err);
        });
});

function changeState(changeType) {
    console.assert(changeType === 'enable' || changeType === 'disable',
        `alert change operation "${changeType}" not recognized`);

    return function(req, res, next) {
        const id = req.params.id;

        Alerts.getAlerts()
            .then(alerts => {
                if (!alerts.find(a => a.id === id)) {
                    logger.warn(`Couldn't find alert named "${id}"`);
                    return res.status(404).send();
                }

                Alerts[changeType](id)
                    .then(() => res.status(200).send())
                    .catch(err => {
                        logger.error(`problem ${changeType}ing alert ${id}`, err);
                        return next(err);
                    });
            });
    };
}

router.post('/alerts/:id/enable', changeState('enable'));
router.post('/alerts/:id/disable', changeState('disable'));

module.exports = router;
