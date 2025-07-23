import db from '../../config/db.js';

class Bar {
  static async create(barData) {
    const conn = await db.getConnection();
    try {
      const [result] = await conn.execute(
        `INSERT INTO bar (BarRequirementID, LiquorTimeFrom, LiquorTimeTo, BarPax, 
         TotalBitePrice, TotalLiquorPrice, TotalSoftDrinkPrice) 
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          barData.BarRequirementID,
          barData.LiquorTimeFrom,
          barData.LiquorTimeTo,
          barData.BarPax,
          barData.TotalBitePrice,
          barData.TotalLiquorPrice,
          barData.TotalSoftDrinkPrice
        ]
      );
      return result;
    } finally {
      conn.release();
    }
  }

  static async findAll() {
    const conn = await db.getConnection();
    try {
      const [rows] = await conn.query(`
           SELECT 
              b.BarRequirementID,
              b.LiquorTimeFrom,
              b.LiquorTimeTo,
              b.BarPax,
              b.TotalBitePrice,
              b.TotalLiquorPrice,
              b.TotalSoftDrinkPrice,
              c.name AS customerName, 
              bk.booking_date AS eventDate,
              CASE
                  WHEN ce.Event_ID IS NOT NULL THEN ce.Event_Name
                  WHEN w.Event_ID IS NOT NULL THEN 'Wedding'
                  ELSE 'Event Not Specified'
              END AS eventName,
              (
                  SELECT JSON_ARRAYAGG(
                      JSON_OBJECT(
                          'id', bi.id, 
                          'menu_type_name', mt.menu_type_name, 
                          'Quantity', bi.Quantity,
                          'price', mt.price 
                      )
                  )
                  FROM bite bi
                  JOIN menu_type mt ON bi.menu_type_id = mt.menu_type_id
                  WHERE bi.BarRequirementID = b.BarRequirementID
              ) AS bites,
              (
                  SELECT JSON_ARRAYAGG(
                      JSON_OBJECT(
                          'Liquor_ID', li.Liquor_ID, 
                          'item_name', li.item_name, 
                          'quantity', li.quantity, 
                          'LiquorPrice', li.LiquorPrice
                      )
                  )
                  FROM liquor_items li
                  WHERE li.BarRequirementID = b.BarRequirementID
              ) AS liquorItems,
              (
                  SELECT JSON_ARRAYAGG(
                      JSON_OBJECT(
                          'Soft_Drink_id', sdi.Soft_Drink_id, 
                          'Soft_Drink_name', sdi.Soft_Drink_name, 
                          'quantity', sdi.quantity, 
                          'DrinkPrice', sdi.DrinkPrice
                      )
                  )
                  FROM soft_drink_items sdi
                  WHERE sdi.BarRequirementID = b.BarRequirementID
              ) AS softDrinkItems
          FROM bar b
          JOIN event e ON b.BarRequirementID = e.BarRequirementID
          JOIN booking bk ON e.booking_id = bk.booking_id
          JOIN customer c ON bk.customer_id = c.customer_id
          LEFT JOIN customevent ce ON e.Event_ID = ce.Event_ID
          LEFT JOIN wedding w ON e.Event_ID = w.Event_ID
          GROUP BY b.BarRequirementID, c.name, bk.booking_date, eventName
      `);

      return rows.map(row => ({
        ...row,
        bites: typeof row.bites === 'string' ? JSON.parse(row.bites) : (row.bites || []),
        liquorItems: typeof row.liquorItems === 'string' ? JSON.parse(row.liquorItems) : (row.liquorItems || []),
        softDrinkItems: typeof row.softDrinkItems === 'string' ? JSON.parse(row.softDrinkItems) : (row.softDrinkItems || []),
      }));
    } finally {
      conn.release();
    }
  }

  static async findById(id) {
    const conn = await db.getConnection();
    try {
      const [rows] = await conn.execute(`SELECT 
          b.*,
          c.name AS customerName,
          bk.booking_date AS eventDate,
          CASE
              WHEN ce.Event_ID IS NOT NULL THEN ce.Event_Name
              WHEN w.Event_ID IS NOT NULL THEN 'Wedding'
              ELSE 'Event Details Not Specified'
          END AS eventName
        FROM bar b
        JOIN event e ON b.BarRequirementID = e.BarRequirementID
        JOIN booking bk ON e.booking_id = bk.booking_id
        JOIN customer c ON bk.customer_id = c.customer_id
        LEFT JOIN customevent ce ON e.Event_ID = ce.Event_ID
        LEFT JOIN wedding w ON e.Event_ID = w.Event_ID
        WHERE b.BarRequirementID = ?`, [id]);
      return rows[0];
    } finally {
      conn.release();
    }
  }

  static async update(id, barData) {
    const conn = await db.getConnection();
    try {
      const [result] = await conn.execute(
        `UPDATE bar SET 
          LiquorTimeFrom = ?, 
          LiquorTimeTo = ?, 
          BarPax = ?
         WHERE BarRequirementID = ?`,
        [
          barData.LiquorTimeFrom,
          barData.LiquorTimeTo,
          barData.BarPax,
          id
        ]
      );
      return result;
    } finally {
      conn.release();
    }
  }

  static async delete(id) {
    const conn = await db.getConnection();
    try {
      await conn.beginTransaction();

      const [barRows] = await conn.query(
        'SELECT Event_ID FROM event WHERE BarRequirementID = ?',
        [id]
      );
      if (barRows.length === 0) {
        throw new Error(`No event found for BarRequirementID ${id}`);
      }
      const eventId = barRows[0].Event_ID;

      await conn.query('DELETE FROM bite WHERE BarRequirementID = ?', [id]);
      await conn.query('DELETE FROM liquor_items WHERE BarRequirementID = ?', [id]);
      await conn.query('DELETE FROM soft_drink_items WHERE BarRequirementID = ?', [id]);
      console.log(`Deleted all dependent records for BarRequirementID ${id}`);

      await conn.query('UPDATE event SET BarRequirementID = NULL WHERE Event_ID = ?', [eventId]);
      await conn.query('DELETE FROM bar WHERE BarRequirementID = ?', [id]);

      await conn.commit();
      return { success: true };
    } catch (error) {
      await conn.rollback();
      console.error(`Error deleting BarRequirementID ${id}:`, error);
      throw error;
    } finally {
      conn.release();
    }
  }
}

class Bite {
  static async create(biteData) {
    const conn = await db.getConnection();
    try {
      const [result] = await conn.execute(
        `INSERT INTO bite (Bite_ID, Quantity, menu_type_id, BarRequirementID) 
         VALUES (?, ?, ?, ?)`,
        [
          biteData.Bite_ID,
          biteData.Quantity,
          biteData.menu_type_id,
          biteData.BarRequirementID
        ]
      );
      return result;
    } finally {
      conn.release();
    }
  }

  static async findAll() {
    const conn = await db.getConnection();
    try {
      const [rows] = await conn.query(`SELECT 
          bi.*, 
          mt.menu_type_name,
          c.name AS customerName, 
          bk.booking_date AS eventDate,
          CASE
              WHEN ce.Event_ID IS NOT NULL THEN ce.Event_Name
              WHEN w.Event_ID IS NOT NULL THEN 'Wedding'
              ELSE 'Event Details Not Specified'
          END AS eventName
      FROM bite bi
      JOIN menu_type mt ON bi.menu_type_id = mt.menu_type_id
      LEFT JOIN bar b ON bi.BarRequirementID = b.BarRequirementID
      LEFT JOIN event e ON b.BarRequirementID = e.BarRequirementID
      LEFT JOIN booking bk ON e.booking_id = bk.booking_id
      LEFT JOIN customer c ON bk.customer_id = c.customer_id
      LEFT JOIN customevent ce ON e.Event_ID = ce.Event_ID
      LEFT JOIN wedding w ON e.Event_ID = w.Event_ID`);
      return rows;
    } finally {
      conn.release();
    }
  }

  static async findByBar(barId) {
    const conn = await db.getConnection();
    try {
      const [rows] = await conn.execute(`SELECT 
          bi.*, 
          mt.menu_type_name,
          c.name AS customerName, 
          bk.booking_date AS eventDate,
          CASE
              WHEN ce.Event_ID IS NOT NULL THEN ce.Event_Name
              WHEN w.Event_ID IS NOT NULL THEN 'Wedding'
              ELSE 'Event Details Not Specified'
          END AS eventName
      FROM bite bi
      JOIN menu_type mt ON bi.menu_type_id = mt.menu_type_id
      LEFT JOIN bar b ON bi.BarRequirementID = b.BarRequirementID
      LEFT JOIN event e ON b.BarRequirementID = e.BarRequirementID
      LEFT JOIN booking bk ON e.booking_id = bk.booking_id
      LEFT JOIN customer c ON bk.customer_id = c.customer_id
      LEFT JOIN customevent ce ON e.Event_ID = ce.Event_ID
      LEFT JOIN wedding w ON e.Event_ID = w.Event_ID
        WHERE BarRequirementID = ?`, [barId]);
      return rows;
    } finally {
      conn.release();
    }
  }

  static async update(id, biteData) {
    const conn = await db.getConnection();
    try {
      const [result] = await conn.execute(
        `UPDATE bite SET 
        Quantity = ?
       WHERE id = ?`,
        [
          biteData.Quantity,
          id
        ]
      );
      return result;
    } finally {
      conn.release();
    }
  }

  static async delete(id) {
    const conn = await db.getConnection();
    try {
      const [result] = await conn.execute('DELETE FROM bite WHERE id = ?', [id]);
      return result;
    } finally {
      conn.release();
    }
  }
}

class LiquorItem {
  static async create(liquorData) {
    const conn = await db.getConnection();
    try {
      const [result] = await conn.execute(
        `INSERT INTO liquor_items (Liquor_ID, item_name, quantity, usages, BarRequirementID, LiquorPrice) 
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          liquorData.Liquor_ID,
          liquorData.item_name,
          liquorData.quantity,
          liquorData.usages,
          liquorData.BarRequirementID,
          liquorData.LiquorPrice
        ]
      );
      return result;
    } finally {
      conn.release();
    }
  }

  static async findAll() {
    const conn = await db.getConnection();
    try {
      const [rows] = await conn.query(`SELECT
      e.Event_ID,
      c.name AS customerName,
      CASE
          WHEN w.Event_ID IS NOT NULL THEN 'Wedding'
          ELSE ce.Event_Name
      END AS eventName,
      bk.booking_date AS eventDate,
      li.*
  FROM
      event e
  LEFT JOIN
      wedding w ON e.Event_ID = w.Event_ID
  LEFT JOIN
      customevent ce ON e.Event_ID = ce.Event_ID
  JOIN
      booking bk ON e.booking_id = bk.booking_id
  JOIN
      customer c ON bk.customer_id = c.customer_id
  JOIN
      bar b ON e.BarRequirementID = b.BarRequirementID
  LEFT JOIN
      liquor_items li ON b.BarRequirementID = li.BarRequirementID
  WHERE
      e.BarRequirementID IS NOT NULL
  GROUP BY
      e.Event_ID, customerName, eventName, eventDate, li.Liquor_ID;`);
      return rows;
    } finally {
      conn.release();
    }
  }

  static async findByBar(barId) {
    const conn = await db.getConnection();
    try {
      const [rows] = await conn.execute(`
        SELECT
      e.Event_ID,
      c.name AS customerName,
      CASE
          WHEN w.Event_ID IS NOT NULL THEN 'Wedding'
          ELSE ce.Event_Name
      END AS eventName,
      bk.booking_date AS eventDate,
      li.*
  FROM
      event e
  LEFT JOIN
      wedding w ON e.Event_ID = w.Event_ID
  LEFT JOIN
      customevent ce ON e.Event_ID = ce.Event_ID
  JOIN
      booking bk ON e.booking_id = bk.booking_id
  JOIN
      customer c ON bk.customer_id = c.customer_id
  JOIN
      bar b ON e.BarRequirementID = b.BarRequirementID
  LEFT JOIN
      liquor_items li ON b.BarRequirementID = li.BarRequirementID
  WHERE
      e.BarRequirementID IS NOT NULL
  GROUP BY
      e.Event_ID, customerName, eventName, eventDate, li.Liquor_ID
        WHERE BarRequirementID = ?`, [barId]);
      return rows;
    } finally {
      conn.release();
    }
  }

  static async update(id, liquorData) {
    const conn = await db.getConnection();
    try {
      const [result] = await conn.execute(
        `UPDATE liquor_items SET 
          item_name = ?, 
          quantity = ?, 
          usages = ?, 
          LiquorPrice = ? 
         WHERE BarRequirementID = ?`,
        [
          liquorData.item_name,
          liquorData.quantity,
          liquorData.usages,
          liquorData.LiquorPrice,
          id
        ]
      );
      return result;
    } finally {
      conn.release();
    }
  }

  static async delete(id) {
    const conn = await db.getConnection();
    try {
      const [result] = await conn.execute('DELETE FROM liquor_items WHERE BarRequirementID = ?', [id]);
      return result;
    } finally {
      conn.release();
    }
  }
}

class SoftDrinkItem {
  static async create(softDrinkData) {
    const conn = await db.getConnection();
    try {
      const [result] = await conn.execute(
        `INSERT INTO soft_drink_items (Soft_Drink_id, Soft_Drink_name, quantity, usages, BarRequirementID, DrinkPrice) 
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          softDrinkData.Soft_Drink_id,
          softDrinkData.Soft_Drink_name,
          softDrinkData.quantity,
          softDrinkData.usages,
          softDrinkData.BarRequirementID,
          softDrinkData.DrinkPrice
        ]
      );
      return result;
    } finally {
      conn.release();
    }
  }

  static async findAll() {
    const conn = await db.getConnection();
    try {
      const [rows] = await conn.query(`
        SELECT 
          sdi.*, 
          c.name AS customerName, 
          bk.booking_date AS eventDate,
          CASE
              WHEN ce.Event_ID IS NOT NULL THEN ce.Event_Name
              WHEN w.Event_ID IS NOT NULL THEN 'Wedding'
              ELSE 'Event Details Not Specified'
          END AS eventName
        FROM soft_drink_items sdi
        JOIN bar b ON sdi.BarRequirementID = b.BarRequirementID
        JOIN event e ON b.BarRequirementID = e.BarRequirementID
        JOIN booking bk ON e.booking_id = bk.booking_id
        JOIN customer c ON bk.customer_id = c.customer_id
        LEFT JOIN customevent ce ON e.Event_ID = ce.Event_ID
        LEFT JOIN wedding w ON e.Event_ID = w.Event_ID`);
      return rows;
    } finally {
      conn.release();
    }
  }

  static async findByBar(barId) {
    const conn = await db.getConnection();
    try {
      const [rows] = await conn.execute(`
        SELECT 
          sdi.*, 
          c.name AS customerName, 
          bk.booking_date AS eventDate,
          CASE
              WHEN ce.Event_ID IS NOT NULL THEN ce.Event_Name
              WHEN w.Event_ID IS NOT NULL THEN 'Wedding'
              ELSE 'Event Details Not Specified'
          END AS eventName
        FROM soft_drink_items sdi
        JOIN bar b ON sdi.BarRequirementID = b.BarRequirementID
        JOIN event e ON b.BarRequirementID = e.BarRequirementID
        JOIN booking bk ON e.booking_id = bk.booking_id
        JOIN customer c ON bk.customer_id = c.customer_id
        LEFT JOIN customevent ce ON e.Event_ID = ce.Event_ID
        LEFT JOIN wedding w ON e.Event_ID = w.Event_ID
        WHERE BarRequirementID = ?`, [barId]);
      return rows;
    } finally {
      conn.release();
    }
  }

  static async update(id, softDrinkData) {
    const conn = await db.getConnection();
    try {
      const [result] = await conn.execute(
        `UPDATE soft_drink_items SET 
          Soft_Drink_name = ?, 
          quantity = ?, 
          usages = ?, 
          BarRequirementID = ?, 
          DrinkPrice = ? 
         WHERE Soft_Drink_id = ?`,
        [
          softDrinkData.Soft_Drink_name,
          softDrinkData.quantity,
          softDrinkData.usages,
          softDrinkData.BarRequirementID,
          softDrinkData.DrinkPrice,
          id
        ]
      );
      return result;
    } finally {
      conn.release();
    }
  }

  static async delete(id) {
    const conn = await db.getConnection();
    try {
      const [result] = await conn.execute('DELETE FROM soft_drink_items WHERE BarRequirementID = ?', [id]);
      return result;
    } finally {
      conn.release();
    }
  }
}

export { Bar, Bite, LiquorItem, SoftDrinkItem };