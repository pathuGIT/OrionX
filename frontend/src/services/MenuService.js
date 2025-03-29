import api from './Api';

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