import CategoryMenuTypeModel from "../models/categoryMenuTypeModel.js";

export const getAllCategoryMenuTypes = async (req, res) => {
    try {
        const categoryMenuTypes = await CategoryMenuTypeModel.getAllCategoryMenuTypes();
        res.json(categoryMenuTypes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getCategoryMenuTypeById = async (req, res) => {
    try {
        const categoryMenuType = await CategoryMenuTypeModel.getCategoryMenuTypeById(req.params.id);
        if (!categoryMenuType) {
            return res.status(404).json({ message: "Category Menu Type not found" });
        }
        res.json(categoryMenuType);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const createCategoryMenuType = async (req, res) => {
    try {
        const { category_menu_type_Id, menu_type_id, category_id, item_limit } = req.body;
        await CategoryMenuTypeModel.createCategoryMenuType(category_menu_type_Id, menu_type_id, category_id, item_limit);
        res.status(201).json({ message: "Category Menu Type created successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const updateCategoryMenuType = async (req, res) => {
    try {
        const { menu_type_id, category_id, item_limit } = req.body;
        const updated = await CategoryMenuTypeModel.updateCategoryMenuType(req.params.id, menu_type_id, category_id, item_limit);
        if (updated === 0) {
            return res.status(404).json({ message: "Category Menu Type not found" });
        }
        res.json({ message: "Category Menu Type updated successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const deleteCategoryMenuType = async (req, res) => {
    try {
        const deleted = await CategoryMenuTypeModel.deleteCategoryMenuType(req.params.id);
        if (deleted === 0) {
            return res.status(404).json({ message: "Category Menu Type not found" });
        }
        res.json({ message: "Category Menu Type deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export default {
    getAllCategoryMenuTypes,
    getCategoryMenuTypeById,
    createCategoryMenuType,
    updateCategoryMenuType,
    deleteCategoryMenuType
};
