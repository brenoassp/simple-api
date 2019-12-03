const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  event: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    required: true,
    default: Date.now
  },
});

module.exports = mongoose.model("Event", eventSchema);