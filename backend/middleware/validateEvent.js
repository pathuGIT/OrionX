// middlewares/validateEvent.js
const validateEvent = (req, res, next) => {
    const { eventType, eventDate, pax, contactPersonName, contactPersonNumber } = req.body;

    if (!eventType || !eventDate || !pax || !contactPersonName || !contactPersonNumber) {
        return res.status(400).json({ error: 'All fields are required.' });
    }

    next();
};

export { validateEvent }; // Named export