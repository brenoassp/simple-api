const Event = require("../../models/event");

const addEvent = async (req, res) => {
    console.log(req.body);
    const event = new Event({
        event: req.body.event
    });

    try {
        const newEvent = await event.save();
        res.status(201).json(newEvent);
        res.send('evento adicionado :)');
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
    res.send('asdq');
    
};

exports.addEvent = addEvent;