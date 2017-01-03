const router = require('express').Router();
const doors = require('../../config/doors');
const gpio = require('../lib/gpio-gateway');
const _ = require('lodash');

router.get('/doors', (req, res) => {

    Promise.all(doors.map(gpio.isOpen)).then(states => {

        const result = _.zip(doors, states).map(combined => {
            return {
                name: combined[0].name,
                id: combined[0].id,
                open: combined[1]
            };
        });

        res.json(result);
    });

});

router.post('/doors/:id/toggle', (req, res) => {
    const door = doors.find(d => d.id === Number(req.params.id));
    if (!door) {
        return res.status(404).send();
    }

    gpio.toggle(door).then(() => {
        res.status(200).send();
    });

});

module.exports = router;
