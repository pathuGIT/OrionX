import React, { useState } from "react";
import { createEvents } from "../services/EventService"; // Import API function


const EventForm = ({ bookingId }) => {

    console.log("Booking ID:", bookingId); // Log the bookingId for debugging
    const [formData, setFormData] = useState({
        eventName: "",
        buffetTimeFrom: "",
        buffetTimeTo: "",
        additionalTime: "",
        functionDurationFrom: "",
        functionDurationTo: "",
        teaTableTime: "",
        dressTime: "",
        bookingID: bookingId || "",
        contactPersonName: "",
        contactPersonNumber: "",
    });

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [step, setStep] = useState(1); // Step tracker

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleNext = () => setStep(step + 1);
    const handleBack = () => setStep(step - 1);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");
        setError("");

        try {
            const response = await createEvents(formData); // Assuming createEvents is the API function
            setMessage(response.message);
            setFormData({
                eventName: "",
                buffetTimeFrom: "",
                buffetTimeTo: "",
                additionalTime: "",
                functionDurationFrom: "",
                functionDurationTo: "",
                teaTableTime: "",
                dressTime: "",
                bookingID: "",
                contactPersonName: "",
                contactPersonNumber: "",
            });
            setStep(1);
        } catch (err) {
            setError(err.response?.data?.error || "An error occurred while creating the event.");
        }
    };

    return (
        <div className="max-w-lg mx-auto p-6 bg-gray-100 rounded-lg shadow-md text-center">
            {message && <p className="text-green-600">{message}</p>}
            {error && <p className="text-red-600">{error}</p>}
            <form onSubmit={handleSubmit} className="space-y-4">
                {step === 1 && (
                    <div className="flex flex-col items-center">
                        <label className="w-full text-left">Event Name:</label>
                        <input type="text" name="eventName" value={formData.eventName} onChange={handleChange} required
                            className="w-full p-2 border rounded" />
                        <label className="w-full text-left">Contact Person Name:</label>
                        <input
                            type="text"
                            name="contactPersonName"
                            value={formData.contactPersonName}
                            onChange={handleChange}
                            required
                            className="w-full p-2 border rounded"
                        />

                        <label className="w-full text-left">Contact Person Number:</label>
                        <input
                            type="tel"
                            name="contactPersonNumber"
                            value={formData.contactPersonNumber}
                            onChange={handleChange}
                            required
                            className="w-full p-2 border rounded"
                        />
                        <button type="button" onClick={handleNext}
                            className="w-full bg-green-500 text-white py-2 rounded mt-3 hover:bg-green-600">Next</button>
                    </div>
                )}

                {step === 2 && (
                    <div className="flex flex-col items-center">
                        <h3 className="text-xl font-semibold mb-2">Buffet Timings</h3>
                        <label className="w-full text-left">Buffet Time From:</label>
                        <input type="time" name="buffetTimeFrom" value={formData.buffetTimeFrom} onChange={handleChange}
                            className="w-full p-2 border rounded" />

                        <label className="w-full text-left">Buffet Time To:</label>
                        <input type="time" name="buffetTimeTo" value={formData.buffetTimeTo} onChange={handleChange}
                            className="w-full p-2 border rounded" />

                        <div className="flex justify-between w-full mt-3">
                            <button type="button" onClick={handleBack}
                                className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600">Back</button>
                            <button type="button" onClick={handleNext}
                                className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600">Next</button>
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div className="flex flex-col items-center">
                        <h3 className="text-xl font-semibold mb-2">Function Durations</h3>


                        <label className="w-full text-left">Function Duration From:</label>
                        <input type="time" name="functionDurationFrom" value={formData.functionDurationFrom} onChange={handleChange}
                            className="w-full p-2 border rounded" />

                        <label className="w-full text-left">Function Duration To:</label>
                        <input type="time" name="functionDurationTo" value={formData.functionDurationTo} onChange={handleChange}
                            className="w-full p-2 border rounded" />

                        <label className="w-full text-left">Additional Time(if):</label>
                        <input type="time" name="additionalTime" value={formData.additionalTime} onChange={handleChange}
                            className="w-full p-2 border rounded" />

                        <div className="flex justify-between w-full mt-3">
                            <button type="button" onClick={handleBack}
                                className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600">Back</button>
                            <button type="button" onClick={handleNext}
                                className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600">Next</button>
                        </div>
                    </div>
                )}

                {step === 4 && (
                    <div className="flex flex-col items-center">
                        <h3 className="text-xl font-semibold mb-2">Tea & Dress Timings</h3>
                        <label className="w-full text-left">Tea Table Time:</label>
                        <input type="time" name="teaTableTime" value={formData.teaTableTime} onChange={handleChange}
                            className="w-full p-2 border rounded" />

                        <label className="w-full text-left">Dress Time:</label>
                        <input type="time" name="dressTime" value={formData.dressTime} onChange={handleChange}
                            className="w-full p-2 border rounded" />
                        <div className="flex justify-between w-full mt-3">
                            <button type="button" onClick={handleBack}
                                className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600">
                                Back
                            </button>
                            <button type="submit"
                                className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
                                Submit
                            </button>
                        </div>

                    </div>
                )}
            </form>
        </div>
    );
};

export default EventForm;
