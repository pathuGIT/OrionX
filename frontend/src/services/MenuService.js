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