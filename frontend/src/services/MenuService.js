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

export const addMenuListType = async (menu) => {
  try {
    const response = await api.post('/menuListType/add', menu);
    return response.data;
  } catch (error) {
    console.error("Error adding menu:", error);
    throw error;
  }
};  


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

export const addMenuType = async (menuType) => {
  try {
    const response = await api.post('/menutypes/add', menuType);
    return response.data;
  } catch (error) {
    console.error("Error adding menu type:", error);
    throw error;
  }
};

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

export const addCategory = async (category) => {
  try {
    const response = await api.post('/categories/add', category);
    return response.data;
  } catch (error) {
    console.error("Error adding category:", error);
    throw error;
  }
};

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

export const addItem = async (item) => {
  try {
    const response = await api.post('/items/add', item);
    return response.data;
  } catch (error) {
    console.error("Error adding item:", error);
    throw error;
  }
};


