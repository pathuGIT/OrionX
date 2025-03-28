// backend/controllers/weddingController.js
import Wedding from '../models/weddingModel.js'; // Default import

export const createWedding = (req, res) => {
  try {
      const weddingData = req.body;
  
      Wedding.createWedding(weddingData, (err) => {
          if (err) {
              console.error('Error saving wedding details:', err);
              return res.status(500).json({ error: 'Database error.' });
          }
          res.status(201).json({ message: 'Wedding details saved successfully' });
      });
    } catch (error) {
        res.status(500).json({ msg: 'Server error...', error });
    }
};

