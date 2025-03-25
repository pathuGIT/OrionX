import ICMTModel from "../models/icmtModel.js";

// Get all records from Item_Category_Menu_Type
export const getICMTs = async (req, res) => {
    try {
        const icmt = await ICMTModel.getAllICMT();
        res.json(icmt);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get a single record by ICMT_Id
export const getICMT = async (req, res) => {
    try {
        const icmt = await ICMTModel.getICMTById(req.params.id);
        if (icmt) {
            res.json(icmt);
        } else {
            res.status(404).json({ message: "ICMT record not found" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create a new record in Item_Category_Menu_Type
export const createICMT = async (req, res) => {
    try {
        const { ICMT_Id, category_menu_type_id, item_id } = req.body;
        const insertId = await ICMTModel.createICMT(ICMT_Id, category_menu_type_id, item_id);
        res.status(201).json({ message: "ICMT record added", insertId });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update an existing record in Item_Category_Menu_Type
export const updateICMT = async (req, res) => {
    try {
        const { category_menu_type_id, item_id } = req.body;
        const affectedRows = await ICMTModel.updateICMT(req.params.id, category_menu_type_id, item_id);
        
        if (affectedRows) {
            res.json({ message: "ICMT record updated" });
        } else {
            res.status(404).json({ message: "ICMT record not found" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete a record by ICMT_Id
export const deleteICMT = async (req, res) => {
    try {
        const affectedRows = await ICMTModel.deleteICMT(req.params.id);
        if (affectedRows) {
            res.json({ message: "ICMT record deleted" });
        } else {
            res.status(404).json({ message: "ICMT record not found" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export default {
    getICMTs,
    getICMT,
    createICMT,
    updateICMT,
    deleteICMT
};