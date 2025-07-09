// eventPDFService.js
import PDFDocument from 'pdfkit';

export function generateEventReport(reportData) {
    return new Promise((resolve, reject) => {
        try {
            const doc = new PDFDocument({ size: 'A4', margin: 40, bufferPages: true });
            const buffers = [];

            doc.on('data', buffers.push.bind(buffers));
            doc.on('end', () => resolve(Buffer.concat(buffers)));
            doc.on('error', reject);

            // Determine event type
            const isWedding = reportData.Groom_Name && reportData.Bride_Name;
            const isCustomEvent = reportData.custom_event_name;
            const eventType = isWedding ? 'Wedding' : isCustomEvent ? 'Custom Event' : 'Event';

            // --- Reusable Helpers ---
            const drawHeader = (title) => {
                doc.font('Helvetica-Bold').fontSize(18).text('ORIONX', { align: 'center' });
                doc.fontSize(12).text(title, { align: 'center' });
                doc.moveDown(2);
            };

            const writeSectionHeader = (text) =>
                doc.font('Helvetica-Bold').fontSize(11).text(text, { underline: true }).moveDown(0.7);

            const writeTwoColumnField = (label1, value1, label2, value2) => {
                const y = doc.y;
                doc.font('Helvetica-Bold').fontSize(10).text(label1, 45, y);
                doc.font('Helvetica').text(value1 || 'N/A', 170, y, { width: 150 });
                if (label2) {
                    doc.font('Helvetica-Bold').text(label2, 320, y);
                    doc.font('Helvetica').text(value2 || 'N/A', 420, y, { width: 150 });
                }
                doc.moveDown(1.5);
            };

            const writeCheckbox = (label, isChecked) => {
                doc.font('Helvetica').fontSize(10).text(`${isChecked ? '☑' : '☐'} ${label}`);
            };

            // --- Page 1: Main Details ---
            drawHeader('Final Function Sheet');

            // Booking Details
            writeTwoColumnField(
                'Date:',
                new Date(reportData.booking_date).toLocaleDateString(),
                'Pax:',
                reportData.number_of_guests.toString()
            );

            writeTwoColumnField(
                'Time Slot:',
                reportData.time_slot === 'day' ? 'Day' : 'Night',
                'Event Type:',
                eventType
            );

            // Event-specific details
            if (isWedding) {
                writeTwoColumnField('Groom:', reportData.Groom_Name, 'Contact:', reportData.Groom_Contact_no);
                writeTwoColumnField('Bride:', reportData.Bride_Name, 'Contact:', reportData.Bride_Contact_no);
            } else if (isCustomEvent) {
                writeTwoColumnField('Event Name:', reportData.custom_event_name);
                writeTwoColumnField('Contact Person:', reportData.ContactPersonName, 'Contact:', reportData.ContactPersonNumber);
            }

            // Customer Info
            writeTwoColumnField('Customer:', reportData.customer_name);
            doc.moveDown();

            // Coordinators
            writeSectionHeader('COORDINATORS');
            if (reportData.coordinators) {
                doc.font('Helvetica').fontSize(10).text(reportData.coordinators);
            } else {
                doc.font('Helvetica').fontSize(10).text('No coordinators assigned');
            }
            doc.moveDown();

            // Time Allocations
            writeSectionHeader('TIMINGS');
            writeTwoColumnField(
                'Function Duration:',
                `${reportData.Function_durationFrom} - ${reportData.Function_durationTo}`
            );

            writeTwoColumnField(
                'Buffet Time:',
                `${reportData.Buffet_TimeFrom} - ${reportData.Buffet_TimeTo}`
            );

            if (isWedding) {
                writeTwoColumnField(
                    'Poruwa Ceremony:',
                    `${reportData.Poruwa_CeremonyFrom} - ${reportData.Poruwa_CeremonyTo}`
                );
                writeTwoColumnField(
                    'Registration Time:',
                    reportData.Registration_Time
                );
            }

            writeTwoColumnField('Dress Time:', reportData.Dress_Time);
            writeTwoColumnField('Tea Time:', reportData.Tea_table_Time);
            doc.moveDown();

            // --- Page 2: Arrangements & Menu ---
            doc.addPage();
            drawHeader('Arrangements & Menu');

            // Table Arrangements
            if (reportData.Head_Table_Pax) {
                writeSectionHeader('TABLE ARRANGEMENT');
                writeTwoColumnField('Head Table Pax:', reportData.Head_Table_Pax.toString());
                writeTwoColumnField('Top Cloth:', reportData.Top_Cloth_Color);
                writeTwoColumnField('Table Cloth:', reportData.Table_Cloth_Color);
                writeTwoColumnField('Chair Cover:', reportData.Chair_Cover_Color);
                writeTwoColumnField('Bow Color:', reportData.Bow_Color);
            }
            doc.moveDown();

            // Bar Details
            if (reportData.BarPax) {
                writeSectionHeader('BAR DETAILS');
                writeTwoColumnField('Bar Pax:', reportData.BarPax.toString());
                writeTwoColumnField('Liquor Time:',
                    `${reportData.LiquorTimeFrom} - ${reportData.LiquorTimeTo}`
                );
            }
            doc.moveDown();

            // Services
            if (reportData.selected_services) {
                writeSectionHeader('SERVICES');
                doc.font('Helvetica').fontSize(10)
                    .text(reportData.selected_services.split(', ').map(s => `• ${s}`).join('\n'));
            }
            doc.moveDown();

            // Bites and Drinks
            const writeItems = (title, items) => {
                if (items && items.length > 0) {
                    writeSectionHeader(title);
                    items.forEach(item =>
                        doc.font('Helvetica').fontSize(10)
                            .text(`• ${item.name} x ${item.quantity}`)
                    );
                    doc.moveDown();
                }
            };

            if (reportData.selected_bites) {
                writeItems('BITES', reportData.selected_bites);
            }

            if (reportData.soft_drink_items) {
                writeItems('SOFT DRINKS', reportData.soft_drink_items);
            }

            // --- Signature Section ---
            const signatureY = doc.page.height - 100;
            doc.y = signatureY;

            doc.font('Helvetica').fontSize(10)
                .text('I hereby confirm the above details are accurate:', { align: 'center' });

            doc.moveDown(3);
            doc.font('Helvetica')
                .text('_________________________', 100, doc.y)
                .text('Customer Signature', 130, doc.y + 20);

            doc.text('_________________________', 350, doc.y)
                .text('Staff Signature', 380, doc.y + 20);

            // Finalize PDF
            doc.end();
        } catch (error) {
            reject(error);
        }
    });
}