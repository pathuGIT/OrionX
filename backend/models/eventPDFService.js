import PDFDocument from 'pdfkit';

function generateEventReport(data) {
    const doc = new PDFDocument({ size: 'A4', margin: 50 });

    // Handle stream errors
    doc.on('error', (err) => {
        console.error('PDF generation error:', err);
    });

    const writeHeader = (text) => doc.font('Helvetica-Bold').fontSize(20).text(text, { align: 'center' }).moveDown();
    const writeSubheader = (text) => doc.font('Helvetica-Bold').fontSize(14).text(text).moveDown(0.5);
    
    const writeField = (label, value) => {
        const displayValue = value === null || value === undefined ? 'N/A' : String(value);
        doc.font('Helvetica-Bold').text(`${label}: `, { continued: true })
           .font('Helvetica').text(displayValue);
        doc.moveDown(0.5);
    };

    const writeSection = (title, content) => {
        if (!content) return;
        writeSubheader(title);
        doc.font('Helvetica').fontSize(10).text(content).moveDown();
    };

    writeHeader('Event Summary Report');
    
    // Booking Details
    writeSubheader('Booking Details');
    writeField('Booking ID', data.booking_id);
    writeField('Customer Name', data.customer_name);
    writeField('Customer Contact', `${data.customer_phone || 'N/A'} / ${data.customer_email || 'N/A'}`);
    writeField('Event Date', data.booking_date ? new Date(data.booking_date).toLocaleDateString() : 'N/A');
    writeField('Number of Guests', data.number_of_guests);
    doc.moveDown();

    // Event Information
    writeSubheader('Event Information');
    writeField('Event Name', data.Event_name);
    writeField('Event Type', data.Event_Type);
    
    if (data.Event_Type === 'Wedding') {
        writeField('Groom', data.Groom_Name);
        writeField('Bride', data.Bride_Name);
    } else {
        writeField('Contact Person', data.custom_event_contact);
    }
    
    writeField('Function Time', `${data.Function_durationFrom || 'N/A'} - ${data.Function_durationTo || 'N/A'}`);
    doc.moveDown();

    // Safely handle NULL values
    writeSection('Selected Services', data.selected_services || 'No services selected');
    
    writeSubheader('Table Arrangement');
    writeField('Head Table Pax', data.Head_Table_Pax);
    writeField('Chair Cover Color', data.Chair_Cover_Color);
    writeField('Table Cloth Color', data.Table_Cloth_Color);
    doc.moveDown();

    writeSubheader('Bar & Menu Details');
    writeField('Bar Service Time', `${data.LiquorTimeFrom || 'N/A'} - ${data.LiquorTimeTo || 'N/A'}`);
    
    // Safely handle liquor items
    const liquorItems = data.liquor_items ? data.liquor_items.replace(/; /g, '\n') : 'No liquor items';
    writeSection('Liquor Selection', liquorItems);
    
    // Safely handle soft drinks
    const softDrinks = data.soft_drink_items ? data.soft_drink_items.replace(/; /g, '\n') : 'No soft drinks';
    writeSection('Soft Drink Selection', softDrinks);

    doc.end();
    return doc;
}

export { generateEventReport };