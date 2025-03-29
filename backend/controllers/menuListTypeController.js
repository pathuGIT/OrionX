import MenuListType from "../models/menuListTypeModel.js";

//Get all menus
export const getMenuListType = async (req, res) => {
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
    const { id } = req.params;
    console.log("menu_list_type_id", id);
    const menu = await MenuListType.getMenuById(id);

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
  const { menu_list_name } = req.body;
  try {
    if ( !menu_list_name) {
      return res.status(400).json({ error: "All fields are required" });
    }

    await MenuListType.createMenu( menu_list_name);
    res.status(201).json({ message: "Menu created successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error inserting menu" });
  }
};

// Update a menu
export const updateMenuById = async (req, res) => {
  try {
    const { id } = req.params;
    const { menu_list_name } = req.body;

    const updatedRows = await MenuListType.updateMenu(id, menu_list_name);

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

export default { getMenuListType, getMenuById, createMenu, updateMenuById, deleteMenu };