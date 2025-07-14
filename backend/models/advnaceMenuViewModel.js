import pool from '../config/db.js';
export const getAdvancedMenu = async () => {
  const sql = `
    SELECT 
      f.menu_list_type_id,
      f.menu_list_name,
      e.menu_type_id,
      e.menu_type_name,
      e.price,
      d.category_id,
      d.category_name,
      a.item_limit,
      c.item_id,
      c.item_name
    FROM category_menu_type a
    INNER JOIN item_category_menu_type b ON a.category_menu_type_id = b.category_menu_type_id
    INNER JOIN item c ON b.item_id = c.item_id
    INNER JOIN category d ON a.category_id = d.category_id
    INNER JOIN menu_type e ON a.menu_type_id = e.menu_type_id
    INNER JOIN menu_list_type f ON e.menu_list_type_id = f.menu_list_type_id;
  `;
  const [rows] = await pool.query(sql);
  return rows.reduce((acc, row) => {
    let list = acc.find(l => l.id === row.menu_list_type_id);
    if (!list) {
      list = { id: row.menu_list_type_id, name: row.menu_list_name, types: [] };
      acc.push(list);
    }
    let type = list.types.find(t => t.id === row.menu_type_id);
    if (!type) {
      type = { id: row.menu_type_id, name: row.menu_type_name, price: row.price, categories: [] };
      list.types.push(type);
    }
    let category = type.categories.find(c => c.id === row.category_id && c.limit === row.item_limit);
    if (!category) {
      category = { id: row.category_id, name: row.category_name, limit: row.item_limit, items: [] };
      type.categories.push(category);
    }
    category.items.push({ id: row.item_id, name: row.item_name });
    return acc;
  }, []);
};

export const geall = async () => {
    const [rows] = await pool.query(`SELECT * FROM venue `);
    if (rows.length === 0) {
        return null; // Return null if no result found
    } else {
        return rows; // Return the first result
    }
}