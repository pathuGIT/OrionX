import TableDesign from '../../models/superAdmin/tableDesignModel.js';

// Create a new table design
export const createTableDesign = async (req, res) => {
    try {
        const designData = req.body;
        
        // Validate required fields
        const requiredFields = [
            'Top_Cloth_Color', 
            'Table_Cloth_Color', 
            'Bow_Color', 
            'Chair_Cover_Color'
        ];
        
        const missingFields = requiredFields.filter(field => !designData[field]);
        if (missingFields.length > 0) {
            return res.status(400).json({
                error: `Missing required fields: ${missingFields.join(', ')}`
            });
        }
        
        const newDesign = await TableDesign.createDesign(designData);
        res.status(201).json(newDesign);
    } catch (error) {
        if (error.message.startsWith('Design not found')) {
            return res.status(404).json({ error: error.message });
        }
        console.error('Error creating design:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Get all table designs
export const getAllTableDesigns = async (req, res) => {
    try {
        const designs = await TableDesign.getAllDesigns();
        res.status(200).json(designs);
    } catch (error) {
        console.error('Error fetching designs:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Get a single design by ID
export const getTableDesignById = async (req, res) => {
    try {
        const design = await TableDesign.getDesignById(req.params.id);
        res.json(design);
    } catch (error) {
        if (error.message.startsWith('Design not found')) {
            return res.status(404).json({ error: error.message });
        }
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Update a table design
export const updateTableDesign = async (req, res) => {
    try {
        const { id } = req.params;
        const designData = req.body;
        
        // Validate required fields
        const requiredFields = [
            'Top_Cloth_Color', 
            'Table_Cloth_Color', 
            'Bow_Color', 
            'Chair_Cover_Color'
        ];
        
        const missingFields = requiredFields.filter(field => !designData[field]);
        if (missingFields.length > 0) {
            return res.status(400).json({
                error: `Missing required fields: ${missingFields.join(', ')}`
            });
        }
        
        const updatedDesign = await TableDesign.updateDesign(id, designData);
        res.json(updatedDesign);
    } catch (error) {
        if (error.message.startsWith('Design not found')) {
            return res.status(404).json({ error: error.message });
        }
        console.error('Error updating design:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Delete a table design
export const deleteTableDesign = async (req, res) => {
    try {
        const { id } = req.params;
        await TableDesign.deleteDesign(id);
        res.status(204).send();
    } catch (error) {
        if (error.message.startsWith('Design not found')) {
            return res.status(404).json({ error: error.message });
        }
        console.error('Error deleting design:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export default {
    createTableDesign,
    getAllTableDesigns,
    getTableDesignById,
    updateTableDesign,
    deleteTableDesign
};