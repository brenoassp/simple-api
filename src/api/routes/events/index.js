const router = require('express').Router();
const addEvent = require('../../../controllers/events').addEvent

router.post('/', addEvent);

module.exports = router;