import AdminTableChairArrangement from '../../models/superAdmin/adminTableChairArrangementModel.js';

// Create arrangement
 export  const createAdminArrangement = async(req, res) => {
        try {
            const arrangementData = req.body;

            // --- Validation ---
            if (!arrangementData.Event_ID) {
                return res.status(400).json({ error: 'Event ID is required to create an arrangement.' });
            }
            if (!arrangementData.Head_Table_Pax || arrangementData.Head_Table_Pax <= 0) {
                return res.status(400).json({ error: 'Valid Head Table Pax is required.' });
            }
            if (!arrangementData.Top_Cloth_Color || !arrangementData.Table_Cloth_Color || !arrangementData.Bow_Color || !arrangementData.Chair_Cover_Color) {
                return res.status(400).json({ error: 'All color design fields are required.' });
            }


            const newArrangement = await EventService.createArrangement(arrangementData);
            res.status(201).json({
                message: "Arrangement created successfully!",
                data: newArrangement
            });

        } catch (error) {
            console.error('Controller Error: creating arrangement:', error);
            res.status(500).json({ error: error.message || 'An internal server error occurred.' });
        }

    }
    


// Update arrangement
export const updateArrangement = async (req, res) => {
    try {
        const { id } = req.params;
        const arrangementData = req.body;
        
        if (!arrangementData.reservedTables || arrangementData.reservedTables.length === 0) {
            return res.status(400).json({ 
                error: 'At least one table reservation is required' 
            });
        }
        
        const updatedArrangement = await AdminTableChairArrangement.updateArrangement(id, arrangementData);
        res.json(updatedArrangement);
    } catch (error) {
        if (error.message.startsWith('Arrangement not found')) {
            return res.status(404).json({ error: error.message });
        }
        console.error('Error updating arrangement:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Delete arrangement
export const deleteArrangement = async (req, res) => {
    try {
        const { id } = req.params;
        await AdminTableChairArrangement.deleteArrangement(id);
        res.status(204).send();
    } catch (error) {
        if (error.message.startsWith('Arrangement not found')) {
            return res.status(404).json({ error: error.message });
        }
        console.error('Error deleting arrangement:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Get arrangement by ID
export const getArrangementById = async (req, res) => {
    try {
        const arrangement = await AdminTableChairArrangement.getArrangementById(req.params.id);
        res.json(arrangement);
    } catch (error) {
        if (error.message.startsWith('Arrangement not found')) {
            return res.status(404).json({ error: error.message });
        }
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Get all arrangements
export const getAllArrangements = async (req, res) => {
    try {
        const arrangements = await AdminTableChairArrangement.getAllArrangements();
        res.status(200).json(arrangements);
    } catch (error) {
        console.error('Error fetching arrangements:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


export const getAllEventsForTable = async (req, res) => {
    try {
        const allevents = await AdminTableChairArrangement.getevents();
        res.status(200).json(allevents);
    } catch (error) {
        console.error('Error fetching arrangements:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};



export default {
    createAdminArrangement,
    updateArrangement,
    deleteArrangement,
    getArrangementById,
    getAllArrangements,
    getAllEventsForTable
};