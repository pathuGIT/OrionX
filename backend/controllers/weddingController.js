// backend/controllers/weddingController.js
import Wedding from '../models/wedding.js'; // Default import

export const createWedding = (req, res) => {
    const weddingData = req.body;

    Wedding.createWedding(weddingData, (err) => {
        if (err) {
            console.error('Error saving wedding details:', err);
            return res.status(500).json({ error: 'Database error.' });
        }
        res.status(201).json({ message: 'Wedding details saved successfully' });
    });
};

