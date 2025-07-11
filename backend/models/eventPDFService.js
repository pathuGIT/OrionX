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

            const isWedding = reportData.Groom_Name && reportData.Bride_Name;
            const isCustomEvent = reportData.custom_event_name;
            const eventType = isWedding ? 'Wedding' : isCustomEvent ? 'Custom Event' : 'Event';

            // Header
            const drawHeader = (title) => {
                doc.font('Helvetica-Bold').fontSize(20).fillColor('#000')
                    .text('Deandra', { align: 'center' });
                doc.moveDown(0.3);
                doc.font('Helvetica').fontSize(12).fillColor('gray')
                    .text(title, { align: 'center' });
                doc.moveDown(1);
                drawLine();
            };

            const drawLine = () => {
                doc.moveTo(40, doc.y).lineTo(555, doc.y)
                    .strokeColor('#ccc').lineWidth(0.5).stroke();
                doc.moveDown();
            };

            const writeSectionHeader = (text) => {
                doc.moveDown(1);
                const x = 45;
                doc.font('Helvetica-Bold')
                    .fontSize(12)
                    .fillColor('#000')
                    .text(text.toUpperCase(), x, doc.y, { underline: true });
                drawLine();
            };

            // Updated layout with increased spacing
            const writeTwoColumnField = (label1, value1, label2, value2) => {
                const y = doc.y;
                const valueOffset = 180; // Increased spacing
                const valueOffset2 = 450;

                doc.font('Helvetica-Bold').fontSize(10).fillColor('#000').text(label1, 45, y);
                doc.font('Helvetica').text(value1 || 'N/A', valueOffset, y);

                if (label2) {
                    doc.font('Helvetica-Bold').text(label2, 320, y);
                    doc.font('Helvetica').text(value2 || 'N/A', valueOffset2, y);
                }
                doc.moveDown(1.5);
            };

            const writeBulletItems = (items) => {
                const x = 55;
                items.forEach(item => {
                    doc.font('Helvetica').fontSize(10).text(`• ${item}`, x, doc.y);
                });
                doc.moveDown();
            };

            const writeItems = (title, items) => {
                if (items?.length > 0) {
                    writeSectionHeader(title);
                    const x = 55;
                    items.forEach(item => {
                        doc.font('Helvetica').fontSize(10)
                            .text(`• ${item.name} x ${item.quantity}`, x, doc.y);
                    });
                    doc.moveDown();
                }
            };

            // --- PAGE 1 ---
            drawHeader('Final Function Sheet');

            writeTwoColumnField(
                'Date:',
                new Date(reportData.booking_date).toLocaleDateString(),
                'Pax:',
                reportData.number_of_guests?.toString()
            );

            writeTwoColumnField(
                'Time Slot:',
                reportData.time_slot === 'day' ? 'Day' : 'Night',
                'Event Type:',
                eventType
            );

            if (isWedding) {
                writeTwoColumnField('Groom:', reportData.Groom_Name, 'Contact:', reportData.Groom_Contact_no);
                writeTwoColumnField('Bride:', reportData.Bride_Name, 'Contact:', reportData.Bride_Contact_no);
            } else if (isCustomEvent) {
                writeTwoColumnField('Event Name:', reportData.custom_event_name);
                writeTwoColumnField('Contact Person:', reportData.ContactPersonName, 'Contact:', reportData.ContactPersonNumber);
            }

            writeTwoColumnField('Customer:', reportData.customer_name);
            doc.moveDown();

            // Coordinators
            writeSectionHeader('COORDINATORS');
            doc.font('Helvetica').fontSize(10)
                .text(reportData.coordinators || 'No coordinators assigned', 45, doc.y);
            doc.moveDown();

            // Timings
            writeSectionHeader('TIMINGS');
            writeTwoColumnField('Function Duration:', `${reportData.Function_durationFrom} - ${reportData.Function_durationTo}`);
            writeTwoColumnField('Buffet Time:', `${reportData.Buffet_TimeFrom} - ${reportData.Buffet_TimeTo}`);

            if (isWedding) {
                writeTwoColumnField('Poruwa Ceremony:', `${reportData.Poruwa_CeremonyFrom} - ${reportData.Poruwa_CeremonyTo}`);
                writeTwoColumnField('Registration Time:', reportData.Registration_Time);
            }

            writeTwoColumnField('Dress Time:', reportData.Dress_Time);
            writeTwoColumnField('Tea Time:', reportData.Tea_table_Time);
            doc.moveDown();

            // --- PAGE 2 ---
            doc.addPage();
            drawHeader('Arrangements & Menu');

            if (reportData.Head_Table_Pax) {
                writeSectionHeader('TABLE ARRANGEMENT');
                writeTwoColumnField('Head Table Pax:', reportData.Head_Table_Pax.toString());
                writeTwoColumnField('Top Cloth:', reportData.Top_Cloth_Color);
                writeTwoColumnField('Table Cloth:', reportData.Table_Cloth_Color);
                writeTwoColumnField('Chair Cover:', reportData.Chair_Cover_Color);
                writeTwoColumnField('Bow Color:', reportData.Bow_Color);
            }

            if (reportData.BarPax) {
                writeSectionHeader('BAR DETAILS');
                writeTwoColumnField('Bar Pax:', reportData.BarPax.toString());
                writeTwoColumnField('Liquor Time:', `${reportData.LiquorTimeFrom} - ${reportData.LiquorTimeTo}`);
            }

            if (reportData.selected_services) {
                writeSectionHeader('SERVICES');
                writeBulletItems(reportData.selected_services.split(', '));
            }

            writeItems('BITES', reportData.selected_bites);
            writeItems('SOFT DRINKS', reportData.soft_drink_items);

            // --- SIGNATURE SECTION ---
            if (doc.y > doc.page.height - 180) {
                doc.addPage();
            }

            doc.moveDown(3);
            doc.font('Helvetica').fontSize(10)
                .text('I hereby inform the above information is true & correct.', 45, doc.y);
            doc.moveDown(4);

            const sigLineY = doc.y;
            const sigTextY = sigLineY + 15;

            doc.font('Helvetica').text('_____________________', 70, sigLineY);
            doc.font('Helvetica-Bold').text('Signature of the Guest', 70, sigTextY);

            doc.font('Helvetica').text('_____________________',250, sigLineY);
            doc.font('Helvetica-Bold').text('Meeting by', 282, sigTextY);

            doc.font('Helvetica').text('_____________________', 435, sigLineY);
            doc.font('Helvetica-Bold').text('Date', 467, sigTextY);


            doc.end();
        } catch (error) {
            reject(error);
        }
    });
}
