import pool from "../config/db.js";

// Get all menu views with detailed JOINs
export const getAllMenuViewsModel = async () => {
    const [rows] = await pool.query(`
        SELECT 
            b.ICMT_Id, 
            a.menu_type_id, 
            f.menu_list_name,
            e.menu_list_type_id,
            e.menu_type_name,
            e.price, 
            a.category_id, 
            d.category_name,
            a.item_limit, 
            b.item_id, 
            c.item_name
        FROM category_menu_type a
        INNER JOIN item_category_menu_type b ON a.category_menu_type_id = b.category_menu_type_id
        INNER JOIN item c ON b.item_id = c.item_id
        INNER JOIN category d ON a.category_id = d.category_id
        INNER JOIN menu_type e ON a.menu_type_id = e.menu_type_id
        INNER JOIN menu_list_type f ON e.menu_list_type_id = f.menu_list_type_id
    `);
    return rows;
    
};

// Get a single menu view by ICMT_Id
export const getMenuViewByIdModel = async (ICMT_Id) => {
    const [rows] = await pool.query(`
        SELECT 
            b.ICMT_Id, 
            a.menu_type_id, 
            f.menu_list_name,
            e.menu_list_type_id,
            e.menu_type_name,
            e.price, 
            a.category_id, 
            d.category_name,
            a.item_limit, 
            b.item_id, 
            c.item_name
        FROM category_menu_type a
        INNER JOIN item_category_menu_type b ON a.category_menu_type_id = b.category_menu_type_id
        INNER JOIN item c ON b.item_id = c.item_id
        INNER JOIN category d ON a.category_id = d.category_id
        INNER JOIN menu_type e ON a.menu_type_id = e.menu_type_id
        INNER JOIN menu_list_type f ON e.menu_list_type_id = f.menu_list_type_id
        WHERE b.ICMT_Id = ?
    `, [ICMT_Id]);
    return rows[0];
};
