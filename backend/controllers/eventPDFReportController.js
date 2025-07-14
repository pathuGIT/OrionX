// CORRECTED: Import the model from the 'models' directory
import ReportModel from '../models/eventPDFReportModel.js'; 

// CORRECTED: Import the service from the 'services' directory
import { generateEventReport } from '../models/eventPDFService.js'; 

export const downloadEventReport = async (req, res) => {
    try {
        const { bookingId } = req.params;
        const reportData = await ReportModel.getReportData(bookingId);

        if (!reportData) {
            return res.status(404).json({ message: 'Event details not found for this booking.' });
        }

        const fileName = `Event-Report-${bookingId}.pdf`;
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);

        // CORRECTED: Pass reportData to generate PDF buffer
        const pdfBuffer = await generateEventReport(reportData);
        res.send(pdfBuffer);

    } catch (error) {
        console.error('Failed to generate report:', error);
        
        if (!res.headersSent) {
            res.status(500).json({ 
                message: 'Error generating PDF report.',
                error: error.message 
            });
        }
    }
};


export const getAllBookingReports = async (req, res) => {
    try {
        const reports = await ReportModel.getAllBookingReports();
        res.status(200).json(reports);
    } catch (error) {
        console.error('Error fetching booking reports:', error);
        
        // Handle specific error cases
        if (error.code) {
            // MySQL error
            res.status(500).json({ 
                message: 'Database error',
                errorCode: error.code,
                sqlMessage: error.sqlMessage 
            });
        } else {
            // Generic error
            res.status(500).json({ 
                message: error.message || 'Internal server error' 
            });
        }
    }
};