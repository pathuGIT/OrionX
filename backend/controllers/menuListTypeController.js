import MenuListType from "../models/menuListTypeModel.js";

// Get all menus
export const getMenus = async (req, res) => {
  try {
    const menus = await MenuListType.getAllMenus();
    res.json(menus);
  } catch (error) {
    res.status(500).json({ error: "Database error" });
  }
};

// Get a menu by ID
export const getMenuById = async (req, res) => {
  try {
    const { menu_list_type_id } = req.params;
    const menu = await MenuListType.getMenuById(menu_list_type_id);

    if (!menu) {
      return res.status(404).json({ error: "Menu not found" });
    }

    res.json(menu);
  } catch (error) {
    res.status(500).json({ error: "Database error" });
  }
};

// Create a new menu
export const createMenu = async (req, res) => {
  const { menu_list_type_id, menu_list_name } = req.body;
  try {
    if (!menu_list_type_id || !menu_list_name) {
      return res.status(400).json({ error: "All fields are required" });
    }

    await MenuListType.createMenu(menu_list_type_id, menu_list_name);
    res.status(201).json({ message: "Menu created successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error inserting menu" });
  }
};

// Update a menu
export const updateMenu = async (req, res) => {
  try {
    const { menu_list_type_id } = req.params;
    const { menu_list_name } = req.body;

    const updatedRows = await MenuListType.updateMenu(menu_list_type_id, menu_list_name);

    if (updatedRows === 0) {
      return res.status(404).json({ error: "Menu not found" });
    }

    res.json({ message: "Menu updated successfully" });
  } catch (error) {
    res.status(500).json({ error: "Database error" });
  }
};

// Delete a menu
export const deleteMenu = async (req, res) => {
  try {
    const { menu_list_type_id } = req.params;

    const deletedRows = await MenuListType.deleteMenu(menu_list_type_id);

    if (deletedRows === 0) {
      return res.status(404).json({ error: "Menu not found" });
    }

    res.json({ message: "Menu deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Database error" });
  }
};

export default { getMenus, getMenuById, createMenu, updateMenu, deleteMenu };