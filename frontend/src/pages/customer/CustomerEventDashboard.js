import React, { useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { FaCheckCircle, FaRegCircle, FaArrowRight } from 'react-icons/fa';
import { Loader2, AlertCircle } from 'lucide-react';
import { getEventProgress } from '../../services/EventService'; // Assuming this service is correct
import { decryptBookingId } from "../../utills/encryptionUtils.js";

// Reusable Task Item Component (no changes needed)
const TaskItem = ({ title, status, page, setActivePage }) => {
    const isComplete = status === 'Complete';
    
    return (
        <div className={`flex items-center justify-between p-4 rounded-lg transition-all duration-300 ${isComplete ? 'bg-green-50' : 'bg-gray-50 hover:bg-white'}`}>
            <div className="flex items-center">
                {isComplete ? (
                    <FaCheckCircle className="text-green-500 text-2xl mr-4" />
                ) : (
                    <FaRegCircle className="text-gray-400 text-2xl mr-4" />
                )}
                <div>
                    <h3 className={`font-semibold ${isComplete ? 'text-gray-700' : 'text-gray-800'}`}>{title}</h3>
                    <p className={`text-sm ${isComplete ? 'text-green-600' : 'text-yellow-600'}`}>{status}</p>
                </div>
            </div>
            {!isComplete && page && (
                <button 
                    onClick={() => setActivePage(page)}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600 transition-colors"
                >
                    Start <FaArrowRight className="w-3 h-3" />
                </button>
            )}
        </div>
    );
};


const CustomerEventDashboard = ({ setActivePage }) => {
    const { bookingId: encryptedBookingId } = useParams(); // Get the encrypted ID from URL
    const [progress, setProgress] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Safely decrypt the booking ID using useMemo to prevent re-calculation on every render.
    const decryptedBookingId = useMemo(() => {
        if (!encryptedBookingId) return null;
        try {
            return decryptBookingId(encryptedBookingId);
        } catch (err) {
            console.error("Failed to decrypt booking ID:", err);
            return null; // Return null if decryption fails
        }
    }, [encryptedBookingId]);

    useEffect(() => {
        // If decryption failed or there's no ID, don't make an API call.
        if (!decryptedBookingId) {
            setError("Invalid or missing Booking ID. Cannot load progress.");
            setLoading(false);
            return;
        }

        // Fetch real data from the backend using the decrypted service
        getEventProgress(decryptedBookingId)
            .then(data => {
                setProgress(data);
            })
            .catch(err => {
                setError('Failed to load your event progress. Please try again later.');
            })
            .finally(() => {
                setLoading(false);
            });
    // This effect runs whenever the decryptedBookingId changes.
    }, [decryptedBookingId]);

    // Show an error message if the ID could not be decrypted.
    if (!decryptedBookingId && !loading) {
        return (
            <div className="flex flex-col items-center justify-center h-64 text-red-500">
                <AlertCircle className="w-12 h-12 mb-4" />
                <p className="text-xl font-medium">{error || "Invalid Booking ID."}</p>
            </div>
        );
    }

    if (loading) return <div className="flex justify-center items-center h-64"><Loader2 className="w-12 h-12 text-blue-500 animate-spin" /></div>;
    if (error) return <div className="flex flex-col items-center justify-center h-64 text-red-500"><AlertCircle className="w-12 h-12 mb-4" /><p>{error}</p></div>;
    if (!progress) return <div className="text-center p-8">No progress data available.</div>;

    // Maps the task keys from the backend to the correct frontend page names
    const pageMapping = {
        eventDetails: 'plan-event',
        menuSelection: 'plan-menulist',
        servicesSelection: 'Select-Services',
        tableArrangement: 'Select-Tables',
        barSelection: 'select-bar-arrangements'
    };

    return (
        <div className="p-2">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800">Your Event Planning Progress</h1>
                <p className="text-gray-500 mt-1">Let's get everything ready for your big day!</p>
            </div>

            {/* Overall Progress Bar */}
            <div className="mb-10">
                <div className="flex justify-between items-center mb-2">
                    <h2 className="text-lg font-semibold text-gray-700">Overall Progress</h2>
                    <span className="text-xl font-bold text-blue-600">{progress.overallProgress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4">
                    <div 
                        className="bg-blue-500 h-4 rounded-full transition-all duration-500"
                        style={{ width: `${progress.overallProgress}%` }}
                    ></div>
                </div>
                <p className="text-right text-sm text-gray-500 mt-1">
                    {progress.completedCount} of {progress.totalTasks} tasks completed
                </p>
            </div>

            {/* Checklist */}
            <div className="space-y-4">
                <h2 className="text-lg font-semibold text-gray-700 border-b pb-2">Your Checklist</h2>
                {Object.entries(progress.tasks).map(([key, task]) => (
                    <TaskItem
                        key={key}
                        title={task.title}
                        status={task.status}
                        page={pageMapping[key]}
                        setActivePage={setActivePage}
                    />
                ))}
            </div>
        </div>
    );
};

export default CustomerEventDashboard;
