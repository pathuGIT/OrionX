import db from "../config/db.js";

export const getMenuSelectionsByBooking = async (bookingId) => {
    const [rows] = await db.query(`
        SELECT 
            c.customer_id,
            c.name AS customer_name,
            c.email AS customer_email,
            b.booking_id,
            b.booking_date,
            b.time_slot,
            b.status AS booking_status,
            b.total_price AS booking_total_price,
            b.number_of_guests,
            b.additional_hours,
            cmis.ICMT_Id,
            i.item_id,
            i.item_name,
            icmt.category_menu_type_id,
            cmt.menu_type_id,
            mt.menu_type_name,
            mt.price AS menu_item_price,
            cmt.category_id,
            cat.category_name,
            cmt.item_limit,
            mlt.menu_list_type_id,
            mlt.menu_list_name
        FROM customer_menu_item_selection cmis
        JOIN booking b ON cmis.booking_id = b.booking_id
        JOIN customer c ON b.customer_id = c.customer_id
        JOIN item_category_menu_type icmt ON cmis.ICMT_Id = icmt.ICMT_Id
        JOIN item i ON icmt.item_id = i.item_id
        JOIN category_menu_type cmt ON icmt.category_menu_type_id = cmt.category_menu_type_Id
        JOIN menu_type mt ON cmt.menu_type_id = mt.menu_type_id
        JOIN category cat ON cmt.category_id = cat.category_id
        JOIN menu_list_type mlt ON mt.menu_list_type_id = mlt.menu_list_type_id
        WHERE cmis.booking_id = ?
        ORDER BY mlt.menu_list_name, mt.menu_type_name, cat.category_name, i.item_name
    `, [bookingId]);

    return rows;
};

export const getStructuredMenuSelectionsByBooking = async (bookingId) => {
    const rows = await getMenuSelectionsByBooking(bookingId);
    
    if (rows.length === 0) return null;

    // Extract common booking and customer info from first row
    const firstRow = rows[0];
    const result = {
        customer: {
            customer_id: firstRow.customer_id,
            customer_name: firstRow.customer_name,
            customer_email: firstRow.customer_email
        },
        booking: {
            booking_id: firstRow.booking_id,
            booking_date: firstRow.booking_date,
            time_slot: firstRow.time_slot,
            booking_status: firstRow.booking_status,
            booking_total_price: firstRow.booking_total_price,
            number_of_guests: firstRow.number_of_guests,
            additional_hours: firstRow.additional_hours
        },
        menus: []
    };

    let currentMenuList = null;
    let currentMenuType = null;
    let currentCategory = null;

    rows.forEach(row => {
        // Menu List level
        if (!currentMenuList || currentMenuList.menu_list_type_id !== row.menu_list_type_id) {
            currentMenuList = {
                menu_list_type_id: row.menu_list_type_id,
                menu_list_name: row.menu_list_name,
                menu_types: []
            };
            result.menus.push(currentMenuList);
            currentMenuType = null;
        }

        // Menu Type level
        if (!currentMenuType || currentMenuType.menu_type_id !== row.menu_type_id) {
            currentMenuType = {
                menu_type_id: row.menu_type_id,
                menu_type_name: row.menu_type_name,
                price: row.menu_item_price,
                categories: []
            };
            currentMenuList.menu_types.push(currentMenuType);
            currentCategory = null;
        }

        // Category level
        if (!currentCategory || currentCategory.category_id !== row.category_id) {
            currentCategory = {
                category_id: row.category_id,
                category_name: row.category_name,
                item_limit: row.item_limit,
                items: []
            };
            currentMenuType.categories.push(currentCategory);
        }

        // Item level
        currentCategory.items.push({
            ICMT_Id: row.ICMT_Id,
            item_id: row.item_id,
            item_name: row.item_name
        });
    });

    return result;
};

export const createMenuSelection = async (bookingId, ICMT_Id) => {
    const [result] = await db.query(
        "INSERT INTO customer_menu_item_selection (booking_id, ICMT_Id) VALUES (?, ?)",
        [bookingId, ICMT_Id]
    );
    return result.insertId;
};

export const updateMenuSelection = async (bookingId, oldICMT_Id, newICMT_Id) => {
    const [result] = await db.query(
        "UPDATE customer_menu_item_selection SET ICMT_Id = ? WHERE booking_id = ? AND ICMT_Id = ?",
        [newICMT_Id, bookingId, oldICMT_Id]
    );
    return result.affectedRows;
};

export const deleteMenuSelection = async (bookingId, ICMT_Id) => {
    const [result] = await db.query(
        "DELETE FROM customer_menu_item_selection WHERE booking_id = ? AND ICMT_Id = ?",
        [bookingId, ICMT_Id]
    );
    return result.affectedRows;
};

export const deleteAllMenuSelectionsForBooking = async (bookingId) => {
    const [result] = await db.query(
        "DELETE FROM customer_menu_item_selection WHERE booking_id = ?",
        [bookingId]
    );
    return result.affectedRows;
};

export const menuSelectionExists = async (bookingId, ICMT_Id) => {
    const [rows] = await db.query(
        "SELECT 1 FROM customer_menu_item_selection WHERE booking_id = ? AND ICMT_Id = ? LIMIT 1",
        [bookingId, ICMT_Id]
    );
    return rows.length > 0;
};

export default {
    getMenuSelectionsByBooking,
    getStructuredMenuSelectionsByBooking,
    createMenuSelection,
    updateMenuSelection,
    deleteMenuSelection,
    deleteAllMenuSelectionsForBooking,
    menuSelectionExists
};