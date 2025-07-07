import db from '../../config/db.js';

class AdminTableChairArrangement {
    static async getAllArrangements() {
        let connection;
        try {
            connection = await db.getConnection();
            const [arrangements] = await connection.query(`
                SELECT tca.*, 
                    GROUP_CONCAT(tr.Table_Number) AS reserved_tables,
                    GROUP_CONCAT(tr.Reserve_Name) AS reserve_names
                FROM table_chair_arrangement tca
                LEFT JOIN arrangement_reservation ar ON tca.Arrangement_ID = ar.Arrangement_ID
                LEFT JOIN table_reserve tr ON ar.Table_Reserve_ID = tr.Table_Reserve_ID
                GROUP BY tca.Arrangement_ID
            `);
            return arrangements;
        } catch (error) {
            console.error('Error fetching arrangements:', error);
            throw error;
        } finally {
            if (connection) connection.release();
        }
    }

    static async createArrangement(arrangementData) {
        let connection;
        try {
            connection = await db.getConnection();
            await connection.beginTransaction();
            
            // Create arrangement
            const [result] = await connection.query(
                `INSERT INTO table_chair_arrangement 
                (Arrangement_ID, Head_Table_Pax, Top_Cloth_Color, Table_Cloth_Color, Bow_Color, Chair_Cover_Color) 
                VALUES (?, ?, ?, ?, ?, ?)`,
                [
                    arrangementData.Arrangement_ID,
                    arrangementData.Head_Table_Pax,
                    arrangementData.Top_Cloth_Color,
                    arrangementData.Table_Cloth_Color,
                    arrangementData.Bow_Color,
                    arrangementData.Chair_Cover_Color
                ]
            );
            
            // Create reservations
            for (const table of arrangementData.reservedTables) {
                const tableReserveId = `TAB${Date.now().toString().slice(-6)}`;
                
                await connection.query(
                    `INSERT INTO table_reserve 
                    (Table_Reserve_ID, Table_Number, Reserve_Name) 
                    VALUES (?, ?, ?)`,
                    [tableReserveId, table.tableNumber, table.reserveName]
                );
                
                await connection.query(
                    `INSERT INTO arrangement_reservation 
                    (Arrangement_ID, Table_Reserve_ID) 
                    VALUES (?, ?)`,
                    [arrangementData.Arrangement_ID, tableReserveId]
                );
            }
            
            await connection.commit();
            return { id: arrangementData.Arrangement_ID, ...arrangementData };
        } catch (error) {
            if (connection) await connection.rollback();
            console.error('Error creating arrangement:', error);
            throw error;
        } finally {
            if (connection) connection.release();
        }
    }

    static async updateArrangement(arrangementId, arrangementData) {
        let connection;
        try {
            connection = await db.getConnection();
            await connection.beginTransaction();
            
            // Update arrangement
            const [result] = await connection.query(
                `UPDATE table_chair_arrangement 
                SET Head_Table_Pax = ?, Top_Cloth_Color = ?, Table_Cloth_Color = ?, Bow_Color = ?, Chair_Cover_Color = ? 
                WHERE Arrangement_ID = ?`,
                [
                    arrangementData.Head_Table_Pax,
                    arrangementData.Top_Cloth_Color,
                    arrangementData.Table_Cloth_Color,
                    arrangementData.Bow_Color,
                    arrangementData.Chair_Cover_Color,
                    arrangementId
                ]
            );
            
            if (result.affectedRows === 0) {
                throw new Error(`Arrangement not found: ${arrangementId}`);
            }
            
            // Delete existing reservations
            await connection.query(
                `DELETE ar, tr 
                FROM arrangement_reservation ar
                JOIN table_reserve tr ON ar.Table_Reserve_ID = tr.Table_Reserve_ID
                WHERE ar.Arrangement_ID = ?`,
                [arrangementId]
            );
            
            // Create new reservations
            for (const table of arrangementData.reservedTables) {
                const tableReserveId = `TAB${Date.now().toString().slice(-6)}`;
                
                await connection.query(
                    `INSERT INTO table_reserve 
                    (Table_Reserve_ID, Table_Number, Reserve_Name) 
                    VALUES (?, ?, ?)`,
                    [tableReserveId, table.tableNumber, table.reserveName]
                );
                
                await connection.query(
                    `INSERT INTO arrangement_reservation 
                    (Arrangement_ID, Table_Reserve_ID) 
                    VALUES (?, ?)`,
                    [arrangementId, tableReserveId]
                );
            }
            
            await connection.commit();
            return { id: arrangementId, ...arrangementData };
        } catch (error) {
            if (connection) await connection.rollback();
            console.error('Error updating arrangement:', error);
            throw error;
        } finally {
            if (connection) connection.release();
        }
    }

    static async deleteArrangement(arrangementId) {
        let connection;
        try {
            connection = await db.getConnection();
            await connection.beginTransaction();
            
            // Delete from arrangement_reservation and table_reserve
            await connection.query(
                `DELETE ar, tr 
                FROM arrangement_reservation ar
                JOIN table_reserve tr ON ar.Table_Reserve_ID = tr.Table_Reserve_ID
                WHERE ar.Arrangement_ID = ?`,
                [arrangementId]
            );
            
            // Delete arrangement
            const [result] = await connection.query(
                'DELETE FROM table_chair_arrangement WHERE Arrangement_ID = ?',
                [arrangementId]
            );
            
            if (result.affectedRows === 0) {
                throw new Error(`Arrangement not found: ${arrangementId}`);
            }
            
            await connection.commit();
            return { message: 'Arrangement deleted successfully' };
        } catch (error) {
            if (connection) await connection.rollback();
            console.error('Error deleting arrangement:', error);
            throw error;
        } finally {
            if (connection) connection.release();
        }
    }

    static async getArrangementById(arrangementId) {
        let connection;
        try {
            connection = await db.getConnection();
            const [arrangement] = await connection.query(
                `SELECT tca.*, 
                tr.Table_Reserve_ID, tr.Table_Number, tr.Reserve_Name
                FROM table_chair_arrangement tca
                LEFT JOIN arrangement_reservation ar ON tca.Arrangement_ID = ar.Arrangement_ID
                LEFT JOIN table_reserve tr ON ar.Table_Reserve_ID = tr.Table_Reserve_ID
                WHERE tca.Arrangement_ID = ?`,
                [arrangementId]
            );
            
            if (arrangement.length === 0) {
                throw new Error(`Arrangement not found: ${arrangementId}`);
            }
            
            // Transform to single arrangement with tables array
            const transformed = {
                ...arrangement[0],
                reservedTables: arrangement
                    .filter(row => row.Table_Reserve_ID)
                    .map(row => ({
                        tableReserveId: row.Table_Reserve_ID,
                        tableNumber: row.Table_Number,
                        reserveName: row.Reserve_Name
                    }))
            };
            
            delete transformed.Table_Reserve_ID;
            delete transformed.Table_Number;
            delete transformed.Reserve_Name;
            
            return transformed;
        } catch (error) {
            console.error('Error fetching arrangement by ID:', error);
            throw error;
        } finally {
            if (connection) connection.release();
        }
    }
}

export default AdminTableChairArrangement;