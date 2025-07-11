import db from "../config/db.js";

// Get all menu selections organized hierarchically
export const getStructuredMenuSelections = async () => {
    const [rows] = await db.query(`
        SELECT
            customer_id,
            customer_name,
            customer_email,
            booking_id,
            booking_date,
            time_slot,
            booking_status,
            booking_total_price,
            number_of_guests,
            additional_hours,
            ICMT_Id,
            menu_type_id,
            menu_list_name,
            menu_list_type_id,
            menu_type_name,
            menu_item_price,
            category_id,
            category_name,
            item_limit,
            item_id,
            item_name
        FROM view_customer_menu_item_selection
        ORDER BY customer_name, booking_date DESC, menu_type_name, category_name, item_name
    `);

    const result = [];
    let currentCustomer = null;
    let currentBooking = null;
    let currentMenu = null;
    let currentCategory = null;

    rows.forEach(row => {
        // Customer level
        if (!currentCustomer || currentCustomer.customer_id !== row.customer_id) {
            currentCustomer = {
                customer_id: row.customer_id,
                name: row.customer_name,
                email: row.customer_email,
                bookings: []
            };
            result.push(currentCustomer);
            currentBooking = null;
        }

        // Booking level
        if (!currentBooking || currentBooking.booking_id !== row.booking_id) {
            currentBooking = {
                booking_id: row.booking_id,
                booking_date: row.booking_date,
                time_slot: row.time_slot,
                status: row.booking_status,
                total_price: row.booking_total_price,
                number_of_guests: row.number_of_guests,
                additional_hours: row.additional_hours,
                menus: []
            };
            currentCustomer.bookings.push(currentBooking);
            currentMenu = null;
        }

        // Menu level
        if (!currentMenu || currentMenu.menu_type_id !== row.menu_type_id) {
            currentMenu = {
                menu_type_id: row.menu_type_id,
                menu_list_name: row.menu_list_name,
                menu_type_name: row.menu_type_name,
                categories: []
            };
            currentBooking.menus.push(currentMenu);
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
            currentMenu.categories.push(currentCategory);
        }

        // Item level
        currentCategory.items.push({
            ICMT_Id: row.ICMT_Id,
            item_id: row.item_id,
            item_name: row.item_name,
            price: row.menu_item_price
        });
    });

    return result;
};

// Get structured menu selections by booking ID
export const getStructuredSelectionsByBookingId = async (booking_id) => {
    const [rows] = await db.query(`
        SELECT
            customer_id,
            customer_name,
            customer_email,
            booking_id,
            booking_date,
            time_slot,
            booking_status,
            booking_total_price,
            number_of_guests,
            additional_hours,
            ICMT_Id,
            menu_type_id,
            menu_list_name,
            menu_list_type_id,
            menu_type_name,
            menu_item_price,
            category_id,
            category_name,
            item_limit,
            item_id,
            item_name
        FROM view_customer_menu_item_selection
        WHERE booking_id = ?
        ORDER BY menu_type_name, category_name, item_name
    `, [booking_id]);

    if (rows.length === 0) return null;

    const result = {
        customer_id: rows[0].customer_id,
        customer_name: rows[0].customer_name,
        customer_email: rows[0].customer_email,
        booking_id: rows[0].booking_id,
        booking_date: rows[0].booking_date,
        time_slot: rows[0].time_slot,
        status: rows[0].booking_status,
        total_price: rows[0].booking_total_price,
        number_of_guests: rows[0].number_of_guests,
        additional_hours: rows[0].additional_hours,
        menus: []
    };

    let currentMenu = null;
    let currentCategory = null;

    rows.forEach(row => {
        // Menu level
        if (!currentMenu || currentMenu.menu_type_id !== row.menu_type_id) {
            currentMenu = {
                menu_type_id: row.menu_type_id,
                menu_list_name: row.menu_list_name,
                menu_type_name: row.menu_type_name,
                categories: []
            };
            result.menus.push(currentMenu);
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
            currentMenu.categories.push(currentCategory);
        }

        // Item level
        currentCategory.items.push({
            ICMT_Id: row.ICMT_Id,
            item_id: row.item_id,
            item_name: row.item_name,
            price: row.menu_item_price
        });
    });

    return result;
};

// Get structured menu selections by customer ID
export const getStructuredSelectionsByCustomerId = async (customer_id) => {
    const [rows] = await db.query(`
        SELECT
            customer_id,
            customer_name,
            customer_email,
            booking_id,
            booking_date,
            time_slot,
            booking_status,
            booking_total_price,
            number_of_guests,
            additional_hours,
            ICMT_Id,
            menu_type_id,
            menu_list_name,
            menu_list_type_id,
            menu_type_name,
            menu_item_price,
            category_id,
            category_name,
            item_limit,
            item_id,
            item_name
        FROM view_customer_menu_item_selection
        WHERE customer_id = ?
        ORDER BY booking_date DESC, menu_type_name, category_name, item_name
    `, [customer_id]);

    if (rows.length === 0) {
        // No bookings found for customer
        return null;
    }

    const result = {
        customer_id: rows[0].customer_id,
        customer_name: rows[0].customer_name,
        customer_email: rows[0].customer_email,
        bookings: []
    };

    let currentBooking = null;
    let currentMenu = null;
    let currentCategory = null;

    rows.forEach(row => {
        // Booking level
        if (!currentBooking || currentBooking.booking_id !== row.booking_id) {
            currentBooking = {
                booking_id: row.booking_id,
                booking_date: row.booking_date,
                time_slot: row.time_slot,
                status: row.booking_status,
                total_price: row.booking_total_price,
                number_of_guests: row.number_of_guests,
                additional_hours: row.additional_hours,
                menus: []
            };
            result.bookings.push(currentBooking);
            currentMenu = null;
        }

        // Menu level
        if (!currentMenu || currentMenu.menu_type_id !== row.menu_type_id) {
            currentMenu = {
                menu_type_id: row.menu_type_id,
                menu_list_name: row.menu_list_name,
                menu_type_name: row.menu_type_name,
                categories: []
            };
            currentBooking.menus.push(currentMenu);
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
            currentMenu.categories.push(currentCategory);
        }

        // Item level
        currentCategory.items.push({
            ICMT_Id: row.ICMT_Id,
            item_id: row.item_id,
            item_name: row.item_name,
            price: row.menu_item_price
        });
    });

    return result;
};

// CRUD operations

export const createSelection = async (booking_id, ICMT_Id) => {
    const [result] = await db.query(
        "INSERT INTO customer_menu_item_selection (booking_id, ICMT_Id) VALUES (?, ?)",
        [booking_id, ICMT_Id]
    );
    return result.insertId;
};

export const updateSelection = async (oldICMT_Id, booking_id, newICMT_Id) => {
    const [result] = await db.query(
        "UPDATE customer_menu_item_selection SET ICMT_Id = ? WHERE booking_id = ? AND ICMT_Id = ?",
        [newICMT_Id, booking_id, oldICMT_Id]
    );
    return result.affectedRows;
};

export const deleteSelection = async (booking_id, ICMT_Id) => {
    const [result] = await db.query(
        "DELETE FROM customer_menu_item_selection WHERE booking_id = ? AND ICMT_Id = ?",
        [booking_id, ICMT_Id]
    );
    return result.affectedRows;
};

export const selectionExists = async (booking_id, ICMT_Id) => {
    const [rows] = await db.query(
        "SELECT 1 FROM customer_menu_item_selection WHERE booking_id = ? AND ICMT_Id = ? LIMIT 1",
        [booking_id, ICMT_Id]
    );
    return rows.length > 0;
};

export default {
    getStructuredMenuSelections,
    getStructuredSelectionsByBookingId,
    getStructuredSelectionsByCustomerId,
    createSelection,
    updateSelection,
    deleteSelection,
    selectionExists
};
