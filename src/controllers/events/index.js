const Event = require("../../models/event");
const AutoComplete = require("../../autocomplete");

const addEvent = async (req, res) => {
  AutoComplete.then(async (obj) => {
    const event = new Event({
      event: req.body.event
    });
    await obj.addEvent(event);
    res.status(201).json(event);
  });
};

const listEvent = async (req, res) => {
  let { prefix } = req.params;
  if (prefix) {
    AutoComplete.then(obj => {
      obj.getCompletions(prefix).then(completions => {
        res.status(200).json(completions);
      });
    });
    return;
  }
  AutoComplete.then((obj) => {
    obj.getAllEvents().then((events) => {
      res.status(200).json(events);
    });
  });
};

exports.addEvent = addEvent;
exports.listEvent = listEvent;