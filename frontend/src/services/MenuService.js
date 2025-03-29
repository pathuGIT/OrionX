import api from './Api';

export const getMenus = async () => {
    try {
        const response = await api.get('/menus');
        return response.data;
    } catch (error) {
        console.error("Error fetching menus:", error);
        throw error;
    }
};

export const addMenuListType = async (menu) => {
    try {
      const response = await fetch('/api/menu-list-types', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(menu),
      });
      const data = await response.json();
      return data;  // Assuming the response contains a success message or the added data
    } catch (error) {
      console.error('Error adding menu list type:', error);
      throw error;
    }
  };  