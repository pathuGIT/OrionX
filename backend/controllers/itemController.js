import ItemModel from "../models/itemModel.js";

// Controllers for Item Table
export const getItems = async (req, res) => {
    try {
        const items = await ItemModel.getAllItems();
        res.json(items);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getItem = async (req, res) => {
    try {
        const item = await ItemModel.getItemById(req.params.id);
        if (item) {
            res.json(item);
        } else {
            res.status(404).json({ message: "Item not found" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const createItem = async (req, res) => {
    try {
        const {item_name } = req.body;
        const insertId = await ItemModel.createItem(item_name);
        res.status(201).json({ message: "Item added"});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateItem = async (req, res) => {
    try {
        const { item_name } = req.body;
        const affectedRows = await ItemModel.updateItem(req.params.id, item_name);
        if (affectedRows) {
            res.json({ message: "Item updated" });
        } else {
            res.status(404).json({ message: "Item not found" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteItem = async (req, res) => {
    try {
        const affectedRows = await ItemModel.deleteItem(req.params.id);
        if (affectedRows) {
            res.json({ message: "Item deleted" });
        } else {
            res.status(404).json({ message: "Item not found" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export default {
    getItems,
    getItem,
    createItem,
    updateItem,
    deleteItem
};