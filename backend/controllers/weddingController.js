import Wedding from '../models/weddingModel.js'; // Import the Wedding model

export const createWedding = async (req, res) => {
    try {
        const weddingData = req.body;
        console.log("Received wedding data:", weddingData); // Log received data

        if (!weddingData) {
            return res.status(400).json({ success: false, message: "Wedding data is required." });
        }

        // Ensure Wedding.createWedding returns a Promise instead of using callbacks
        const wedding = await Wedding.createWedding(weddingData);

        res.status(201).json({ success: true, message: "Wedding details saved successfully", data: wedding });
    } catch (error) {
        console.error("Error creating wedding:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};
