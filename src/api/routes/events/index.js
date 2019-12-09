const router = require('express').Router();
const addEvent = require('../../../controllers/events').addEvent
const listEvent = require('../../../controllers/events').listEvent

router.post('/', addEvent);
router.get('/:prefix?', listEvent);

module.exports = router;