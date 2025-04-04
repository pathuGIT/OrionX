import api from './Api';

//to display all menulisttypes and add new menulisttypes through form
export const getMenus = async () => {
  try {
    const response = await api.get('/menuListType/getAll');
    return response.data;
  } catch (error) {
    console.error("Error fetching menus:", error);
    throw error;
  }
};

//get menu list type by id
export const getMenuListTypeById = async (id) => {
  try {
    const response = await api.get(`/menuListType/get/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error getting menu list type:", error);
    throw error;
  }
}; 

//add new menu list type
export const addMenuListType = async (menu) => {
  try {
    const response = await api.post('/menuListType/add', menu);
    return response.data;
  } catch (error) {
    console.error("Error adding menu list type:", error);
    throw error;
  }
};  

//delete new menu list type by id
export const deleteMenuListType = async (id) => {
  try {
    const response = await api.delete(`/menuListType/delete/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting menu list type:", error);
    throw error;
  }
}; 

// update menu list type by id
export const updateMenuListTypeById = async (id, data) => {
  console.log(id,data);
  const name = {menu_list_name:data}
  try {
    const response = await api.put(`/menuListType/update/${id}`, name);
    return response.data;
  } catch (error) {
    console.error("Error updating menu list type:", error);
    throw error;
  }
}; 
////////////////////////////////////////////////////////////////////////////////////////////////////////////



//to display all menytypes and add new menu types through form
export const getMenuTypes = async () => {
  try {
    const response = await api.get('/menutypes/getAll');
    return response.data;
  } catch (error) {
    console.error("Error fetching menu types:", error);
    throw error;
  }
};

//to get one menutype by id
export const getMenuTypeById = async (id) => {
  try {
    const response = await api.get(`/menutypes/get/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error adding menutype:", error);
    throw error;
  }
}; 

//to insert a menutype 
export const addMenuType = async (menuType) => {
  try {
    const response = await api.post('/menutypes/add', menuType);
    return response.data;
  } catch (error) {
    console.error("Error adding menu type:", error);
    throw error;
  }
};

//delete menu type by id
export const deleteMenuType = async (id) => {
  try {
    const response = await api.delete(`/menutypes/delete/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting menu type:", error);
    throw error;
  }
}

// update menu type by id
export const updateMenuTypeById = async (data) => {
  console.log(data);
  try {
    const response = await api.put(`/menutypes/update/${data.menu_type_id}`, data);
    return response.data;
  } catch (error) {
    console.error("Error updating menu type:", error);
    throw error;
  }
};

//////////////////////////////////////////////////////////////////////////////////

//to display all categories and add new categories through form
export const getCategories = async () => {
  try {
    const response = await api.get('/categories/getAll');
    return response.data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
};


//to insert a category
export const addCategory = async (category) => {
  try {
    const response = await api.post('/categories/add', category);
    return response.data;
  } catch (error) {
    console.error("Error adding category:", error);
    throw error;
  }
};

export const getCategoryById = async (id) => {
  try {
    const response = await api.get(`/categories/get/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error getting category:", error);
    throw error;
  }
}; 

export const deleteCategory = async (id) => {
  try {
    const response = await api.delete(`/categories/delete/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting category:", error);
    throw error;
  }
}; 

export const updateCategoryById = async (id, data) => {
  console.log(id,data);
  const name = {category_name:data}
  try {
    const response = await api.put(`/categories/update/${id}`, name);
    return response.data;
  } catch (error) {
    console.error("Error updating category:", error);
    throw error;
  }
}; 

//////////////////////////////////////////////////////////////////////

//to display all items and add new items through form
export const getItems = async () => {
  try {
    const response = await api.get('/items/getAll');
    return response.data;
  } catch (error) {
    console.error("Error fetching items:", error);
    throw error;
  }
};

//to insert an item
export const addItem = async (item) => {
  try {
    const response = await api.post('/items/add', item);
    return response.data;
  } catch (error) {
    console.error("Error adding item:", error);
    throw error;
  }
};

export const getItemById = async (id) => {
  try {
    const response = await api.get(`/items/get/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error getting item:", error);
    throw error;
  }
}; 



export const deleteItem = async (id) => {
  try {
    const response = await api.delete(`/items/delete/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting item:", error);
    throw error;
  }
}; 


export const updateItem = async (id, data) => {
  console.log(id, data);
  const name = { item_name: data }; 
  try {
    const response = await api.put(`/items/update/${id}`, name);
    return response.data;
  } catch (error) {
    console.error("Error updating item:", error);
    throw error;
  }
};



//////////////////////////////////////////////////////////////////////////////////

// to display all category menu types and add new category menu types through form
export const getCategoryMenuTypes = async () => {
  try {
    const response = await api.get('/categoryMenuTypes/getAll');
    return response.data;
  } catch (error) {
    console.error("Error fetching category menu types:", error);
    throw error;
  }
};


//to insert a category menu type
export const addCategoryMenuType = async (categoryMenu) => {
  try {
    const response = await api.post('/categoryMenuTypes/add', categoryMenu);
    console.log("Category Menu Type added successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error adding category menu type:", error);
    throw error;
  }
};


export const getCategoryMenuTypeById = async (id) => {
  try {
    const response = await api.get(`/categoryMenuTypes/get/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error getting category menu type:", error);
    throw error;
  }
}; 

export const deleteCategoryMenuType = async (id) => {
  try {
    const response = await api.delete(`/categoryMenuTypes/delete/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting category menu type:", error);
    throw error;
  }
}; 

export const updateCategoryMenuTypeById = async (id, data) => {
  console.log(id,data);
  const name = {categoryMenuType_name:data}
  try {
    const response = await api.put(`/categoryMenuTypes/update/${id}`, name);
    return response.data;
  } catch (error) {
    console.error("Error updating category menu type:", error);
    throw error;
  }
}; 

////////////////////////////////////////////////////////////////////////////////


// to display all item category menu types 
export const getItemCategoryMenuTypes = async () => {
  try {
    const response = await api.get('/itemCategoryMenuTypes/getAll');
    return response.data;
  } catch (error) {
    console.error("Error fetching item category menu types:", error);
    throw error;
  }
}

//to insert an item category menu type
export const addItemCategoryMenuType = async (itemCategoryMenu) => {
  try {
    const response = await api.post('/itemCategoryMenuTypes/add', itemCategoryMenu);
    return response.data;
  } catch (error) {
    console.error("Error adding item category menu type:", error);
    throw error;
  }
};

//to get item category menu type by id
export const getItemCategoryMenuTypeById = async (id) => {
  try {
    const response = await api.get(`/itemCategoryMenuTypes/get/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error getting item category menu type:", error);
    throw error;
  }
};

//to delete item category menu type by id
export const deleteItemCategoryMenuType = async (id) => {
  try {
    const response = await api.delete(`/itemCategoryMenuTypes/delete/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting item category menu type:", error);
    throw error;
  }
};

//to update item category menu type by id
export const updateItemCategoryMenuTypeById = async (id, data) => {
  console.log(id,data);
  const name = {itemCategoryMenuType_name:data}
  try {
    const response = await api.put(`/itemCategoryMenuTypes/update/${id}`, name);
    return response.data;
  } catch (error) {
    console.error("Error updating item category menu type:", error);
    throw error;
  }
};