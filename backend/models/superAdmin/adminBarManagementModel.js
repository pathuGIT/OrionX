import db from '../../config/db.js';

class Bar {
  static async create(barData) {
    const [result] = await db.execute(
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
  }

  static async findAll() {
    const [rows] = await db.query('SELECT * FROM bar');
    return rows;
  }

  static async findById(id) {
    const [rows] = await db.execute('SELECT * FROM bar WHERE BarRequirementID = ?', [id]);
    return rows[0];
  }

  static async update(id, barData) {
    const [result] = await db.execute(
      `UPDATE bar SET 
        LiquorTimeFrom = ?, 
        LiquorTimeTo = ?, 
        BarPax = ?, 
        TotalBitePrice = ?, 
        TotalLiquorPrice = ?, 
        TotalSoftDrinkPrice = ? 
       WHERE BarRequirementID = ?`,
      [
        barData.LiquorTimeFrom,
        barData.LiquorTimeTo,
        barData.BarPax,
        barData.TotalBitePrice,
        barData.TotalLiquorPrice,
        barData.TotalSoftDrinkPrice,
        id
      ]
    );
    return result;
  }

  static async delete(id) {
    const [result] = await db.execute('DELETE FROM bar WHERE BarRequirementID = ?', [id]);
    return result;
  }
}

class Bite {
  static async create(biteData) {
    const [result] = await db.execute(
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
  }

  static async findAll() {
    const [rows] = await db.query('SELECT * FROM bite');
    return rows;
  }

  static async findByBar(barId) {
    const [rows] = await db.execute('SELECT * FROM bite WHERE BarRequirementID = ?', [barId]);
    return rows;
  }

  static async update(id, biteData) {
    const [result] = await db.execute(
      `UPDATE bite SET 
        Quantity = ?, 
        menu_type_id = ?, 
        BarRequirementID = ? 
       WHERE id = ?`,
      [
        biteData.Quantity,
        biteData.menu_type_id,
        biteData.BarRequirementID,
        id
      ]
    );
    return result;
  }

  static async delete(id) {
    const [result] = await db.execute('DELETE FROM bite WHERE id = ?', [id]);
    return result;
  }
}

class LiquorItem {
  static async create(liquorData) {
    const [result] = await db.execute(
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
  }

  static async findAll() {
    const [rows] = await db.query('SELECT * FROM liquor_items');
    return rows;
  }

  static async findByBar(barId) {
    const [rows] = await db.execute('SELECT * FROM liquor_items WHERE BarRequirementID = ?', [barId]);
    return rows;
  }

  static async update(id, liquorData) {
    const [result] = await db.execute(
      `UPDATE liquor_items SET 
        item_name = ?, 
        quantity = ?, 
        usages = ?, 
        BarRequirementID = ?, 
        LiquorPrice = ? 
       WHERE Liquor_ID = ?`,
      [
        liquorData.item_name,
        liquorData.quantity,
        liquorData.usages,
        liquorData.BarRequirementID,
        liquorData.LiquorPrice,
        id
      ]
    );
    return result;
  }

  static async delete(id) {
    const [result] = await db.execute('DELETE FROM liquor_items WHERE Liquor_ID = ?', [id]);
    return result;
  }
}

class SoftDrinkItem {
  static async create(softDrinkData) {
    const [result] = await db.execute(
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
  }

  static async findAll() {
    const [rows] = await db.query('SELECT * FROM soft_drink_items');
    return rows;
  }

  static async findByBar(barId) {
    const [rows] = await db.execute('SELECT * FROM soft_drink_items WHERE BarRequirementID = ?', [barId]);
    return rows;
  }

  static async update(id, softDrinkData) {
    const [result] = await db.execute(
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
  }

  static async delete(id) {
    const [result] = await db.execute('DELETE FROM soft_drink_items WHERE Soft_Drink_id = ?', [id]);
    return result;
  }
}

export { Bar, Bite, LiquorItem, SoftDrinkItem };