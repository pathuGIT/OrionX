import ItemCategoryMenuTypeModel from "../models/ItemCategoryMenuTypeModel.js";

// Get all records from Item_Category_Menu_Type
export const getItemCategoryMenuTypes = async (req, res) => {
    try {
        const icmt = await ItemCategoryMenuTypeModel.getItemCategoryMenuTypes();
        res.json(icmt);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get a single record by ICMT_Id
export const getItemCategoryMenuTypeById = async (req, res) => {
    try {
        const icmt = await ItemCategoryMenuTypeModel.getItemCategoryMenuTypeById(req.params.id);
        if (icmt) {
            res.json(icmt);
        } else {
            res.status(404).json({ message: "ItemCategoryMenuType record not found" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create a new record in Item_Category_Menu_Type
export const createItemCategoryMenuType = async (req, res) => {
    try {
        const { ICMT_Id, category_menu_type_id, item_id } = req.body;
        const insertId = await ItemCategoryMenuTypeModel.createItemCategoryMenuType(ICMT_Id, category_menu_type_id, item_id);
        res.status(201).json({ message: "ItemCategoryMenuType record added", insertId });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update an existing record in Item_Category_Menu_Type
export const updateItemCategoryMenuType = async (req, res) => {
    try {
        const { category_menu_type_id, item_id } = req.body;
        const affectedRows = await ItemCategoryMenuTypeModel.updateItemCategoryMenuType(req.params.id, category_menu_type_id, item_id);
        
        if (affectedRows) {
            res.json({ message: "ItemCategoryMenuType record updated" });
        } else {
            res.status(404).json({ message: "ItemCategoryMenuType record not found" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete a record by ICMT_Id
export const deleteItemCategoryMenuType = async (req, res) => {
    try {
        const affectedRows = await ItemCategoryMenuTypeModel.deleteItemCategoryMenuType(req.params.id);
        if (affectedRows) {
            res.json({ message: "ItemCategoryMenuType record deleted" });
        } else {
            res.status(404).json({ message: "ItemCategoryMenuType record not found" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Export all functions
export default {
    getItemCategoryMenuTypes,
    getItemCategoryMenuTypeById,
    createItemCategoryMenuType,
    updateItemCategoryMenuType,
    deleteItemCategoryMenuType
};
