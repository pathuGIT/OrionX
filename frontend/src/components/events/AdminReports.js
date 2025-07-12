import React, { useState, useEffect } from 'react';
import { FaFilePdf, FaSpinner } from 'react-icons/fa';
import { downloadReportAPI } from '../../services/EventService';
import { getAllBookingReports } from '../../services/EventService';

const AdminReports = () => {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [downloading, setDownloading] = useState({});
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchReports = async () => {
            try {
                const data = await getAllBookingReports();
                setReports(data);
            } catch (err) {
                setError('Failed to load reports');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        
        fetchReports();
    }, []);

  const handleDownload = async (bookingId) => {
    setDownloading(prev => ({ ...prev, [bookingId]: true }));
    try {
        // Get the blob response
        const blob = await downloadReportAPI(bookingId);
        
        // Create download link
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `Event-Report-${bookingId}.pdf`);
        document.body.appendChild(link);
        
        // Trigger download
        link.click();
        
        // Cleanup
        setTimeout(() => {
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        }, 100);
        
    } catch (err) {
        console.error(`Download failed for booking ${bookingId}:`, err);
        alert(`Download failed: ${err.message}`);
    } finally {
        setDownloading(prev => ({ ...prev, [bookingId]: false }));
    }
};
    const getEventDetails = (report) => {
        if (report.event_type === 'wedding') {
            return `Groom: ${report.Groom_Name || 'N/A'}, Bride: ${report.Bride_Name || 'N/A'}`;
        }
        if (report.event_type === 'custom') {
            return `${report.Event_Name || 'N/A'} (Contact: ${report.ContactPersonName || 'N/A'})`;
        }
        return 'No event details available';
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <FaSpinner className="animate-spin text-3xl text-blue-500" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                <strong>Error:</strong> {error}
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-6">Event Reports</h1>
            
            <div className="overflow-x-auto rounded-lg shadow">
                <table className="min-w-full bg-white">
                    <thead className="bg-gray-800 text-white">
                        <tr>
                            <th className="py-3 px-4 text-left">Booking ID</th>
                            <th className="py-3 px-4 text-left">Event ID</th>
                            <th className="py-3 px-4 text-left">Customer</th>
                            <th className="py-3 px-4 text-left">Contact</th>
                            <th className="py-3 px-4 text-left">Booking Date</th>
                            <th className="py-3 px-4 text-left">Event Type</th>
                            <th className="py-3 px-4 text-left">Event Details</th>
                            <th className="py-3 px-4 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {reports.map((report) => (
                            <tr 
                                key={report.booking_id} 
                                className="border-b hover:bg-gray-50"
                            >
                                <td className="py-3 px-4">{report.booking_id}</td>
                                <td className="py-3 px-4">{report.Event_ID || 'N/A'}</td>
                                <td className="py-3 px-4">
                                    <div className="font-medium">{report.customer_name}</div>
                                    <div className="text-sm text-gray-600">{report.email}</div>
                                </td>
                                <td className="py-3 px-4">{report.phone}</td>
                                <td className="py-3 px-4">
                                    {new Date(report.booking_date).toLocaleDateString()}
                                </td>
                                <td className="py-3 px-4 capitalize">
                                    {report.event_type || 'N/A'}
                                </td>
                                <td className="py-3 px-4 text-sm text-gray-600">
                                    {getEventDetails(report)}
                                </td>
                                <td className="py-3 px-4 text-center">
                                    <button
                                        onClick={() => handleDownload(report.booking_id)}
                                        disabled={downloading[report.booking_id]}
                                        className={`flex items-center justify-center px-4 py-2 rounded ${
                                            downloading[report.booking_id]
                                                ? 'bg-gray-400 cursor-not-allowed'
                                                : 'bg-blue-600 hover:bg-blue-700 text-white'
                                        }`}
                                    >
                                        {downloading[report.booking_id] ? (
                                            <FaSpinner className="animate-spin mr-2" />
                                        ) : (
                                            <FaFilePdf className="mr-2" />
                                        )}
                                        Report
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            
            {reports.length === 0 && !loading && (
                <div className="text-center py-8 text-gray-500">
                    No event reports found
                </div>
            )}
        </div>
    );
};

export default AdminReports;