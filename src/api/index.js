const express = require('express');
const router = express.Router();

const events = require('./routes/events');

router.use('/events', events);

module.exports = router;
