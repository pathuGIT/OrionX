import db from '../config/db.js';

const checkCompletion = async (query, params) => {
    try {
        const [rows] = await db.query(query, params);
        return rows.length > 0;
    } catch (error) {
        console.error(`Query failed: ${query}`, error.message);
        return false;
    }
};

class CustomerDashboardModel {
    static async getPlanningStatus(bookingId) {
        // First determine event type
        const eventType = await this.getEventType(bookingId);

        const tasks = [
            {
                key: 'eventDetails',
                title: 'Define Event Details',
                query: 'SELECT 1 FROM event WHERE booking_id = ?'
            },
            {
                key: 'menuSelection',
                title: 'Select Your Menu',
                query: `SELECT 1 FROM view_customer_menu_item_selection WHERE booking_id = ?`
            },
            {
                key: 'servicesSelection',
                title: 'Choose Your Services',
                query: `SELECT 1 FROM customer_event_service 
                        WHERE booking_id = ?`
            },
            {
                key: 'tableArrangement',
                title: 'Arrange Seating & Tables',
                // CORRECTED QUERY: This now correctly checks the event_table_chair table.
                query: `SELECT 1 FROM event e
                        JOIN event_table_chair etc ON e.Event_ID = etc.Event_ID
                        WHERE e.booking_id = ?`
            },
            {
                key: 'barSelection',
                title: 'Finalize Bar & Drink Selection',
                // CORRECTED QUERY: This now checks if LiquorTimeFrom and LiquorTimeTo are set.
                query: `SELECT 1 FROM event e
                        JOIN bar br ON e.BarRequirementID = br.BarRequirementID
                        WHERE e.booking_id = ? AND 
                              br.LiquorTimeFrom IS NOT NULL AND 
                              br.LiquorTimeTo IS NOT NULL`
            }
        ];

        const statusResults = {};
        let completedCount = 0;

        for (const task of tasks) {
            const isComplete = await checkCompletion(task.query, [bookingId]);
            statusResults[task.key] = {
                title: task.title,
                status: isComplete ? 'Complete' : 'Pending'
            };
            if (isComplete) completedCount++;
        }

        const totalTasks = tasks.length;
        const overallProgress = Math.round((completedCount / totalTasks) * 100);

        return {
            tasks: statusResults,
            overallProgress,
            completedCount,
            totalTasks,
            eventType
        };
    }

    static async getEventType(bookingId) {
        try {
            const [eventRows] = await db.query(
                `SELECT Event_Type FROM event WHERE booking_id = ?`,
                [bookingId]
            );

            if (eventRows.length === 0) return 'unknown';

            // Check if it's a wedding
            const [weddingRows] = await db.query(
                `SELECT 1 FROM wedding WHERE Event_ID = ?`,
                [eventRows[0].Event_ID]
            );

            return weddingRows.length > 0 ? 'wedding' : 'custom';
        } catch (error) {
            console.error('Error determining event type:', error);
            return 'unknown';
        }
    }
}

export default CustomerDashboardModel;