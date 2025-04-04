import CategoryModel from "../models/categoryModel.js";

export const getAllCategories = async (req, res) => {
    try {
        const categories = await CategoryModel.getAllCategories();
        res.json(categories);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getCategoryById = async (req, res) => {
    try {
      const { id } = req.params;
      const category = await CategoryModel.getCategoryById(id);
  
      if (!category) {
        return res.status(404).json({ error: "Category not found" });
      }
  
      res.json(category);
    } catch (error) {
      res.status(500).json({ error: "Database error" });
    }
  };
  

export const createCategory = async (req, res) => {
    try {
        const {category_name } = req.body;
        await CategoryModel.createCategory(category_name);
        res.status(201).json({ message: "Category created successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const updateCategory = async (req, res) => {
    try {
        const { category_name } = req.body;
        const updated = await CategoryModel.updateCategory(req.params.id, category_name);
        if (updated === 0) {
            return res.status(404).json({ message: "Category not found" });
        }
        res.json({ message: "Category updated successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const deleteCategory = async (req, res) => {
    try {
        const deleted = await CategoryModel.deleteCategory(req.params.id);
        if (deleted === 0) {
            return res.status(404).json({ message: "Category not found" });
        }
        res.json({ message: "Category deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export default {
    getAllCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory
};
