import React, { useState } from "react";
import { createWedding } from "../services/EventService"; // Import API function

const WeddingForm = () => {
    const [formData, setFormData] = useState({
        groomName: "",
        brideName: "",
        groomContact: "",
        brideContact: "",
        fountain: "",
        prosperityTable: "",
        groomAddress: "",
        brideAddress: "",
        ceremonyFrom: "",
        ceremonyTo: "",
        registrationTime: "",
    });

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [step, setStep] = useState(1);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === "checkbox" ? checked : value,
        });
    };

    const handleNext = () => setStep(step + 1);
    const handleBack = () => setStep(step - 1);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");
        setError("");

        try {
            const response = await createWedding(formData);
            setMessage(response.message);
            setFormData({
                groomName: "",
                brideName: "",
                groomContact: "",
                brideContact: "",
                fountain: "",
                prosperityTable: "",
                groomAddress: "",
                brideAddress: "",
                ceremonyFrom: "",
                ceremonyTo: "",
                registrationTime: "",
            });
            setStep(1);
        } catch (err) {
            setError(err.response?.data?.error || "An error occurred while creating the wedding.");
        }
    };

    return (
        <div className="max-w-lg mx-auto p-6 bg-gray-100 rounded-lg shadow-md text-center">
            <h2 className="text-2xl font-bold mb-4">Create Wedding Event</h2>
            {message && <p className="text-green-600">{message}</p>}
            {error && <p className="text-red-600">{error}</p>}

            <form onSubmit={handleSubmit} className="space-y-4">
                {step === 1 && (
                    <div className="flex flex-col items-center">
                        <h3 className="text-xl font-semibold mb-2">Groom Details</h3>
                        <label className="w-full text-left">Groom Name:</label>
                        <input type="text" name="groomName" value={formData.groomName} onChange={handleChange} required className="w-full p-2 border rounded" />
                        
                        <label className="w-full text-left">Groom Contact No:</label>
                        <input type="text" name="groomContact" value={formData.groomContact} onChange={handleChange} required className="w-full p-2 border rounded" />

                        <label className="w-full text-left">Groom Address:</label>
                        <input type="text" name="groomAddress" value={formData.groomAddress} onChange={handleChange} required className="w-full p-2 border rounded" />

                        <button type="button" onClick={handleNext} className="w-full bg-green-500 text-white py-2 rounded mt-3 hover:bg-green-600">Next</button>
                    </div>
                )}

                {step === 2 && (
                    <div className="flex flex-col items-center">
                        <h3 className="text-xl font-semibold mb-2">Bride Details</h3>
                        <label className="w-full text-left">Bride Name:</label>
                        <input type="text" name="brideName" value={formData.brideName} onChange={handleChange} required className="w-full p-2 border rounded" />

                        <label className="w-full text-left">Bride Contact No:</label>
                        <input type="text" name="brideContact" value={formData.brideContact} onChange={handleChange} required className="w-full p-2 border rounded" />

                        <label className="w-full text-left">Bride Address:</label>
                        <input type="text" name="brideAddress" value={formData.brideAddress} onChange={handleChange} required className="w-full p-2 border rounded" />

                        <div className="flex justify-between w-full mt-3">
                            <button type="button" onClick={handleBack} className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600">Back</button>
                            <button type="button" onClick={handleNext} className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600">Next</button>
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div className="flex flex-col items-center">
                        <h3 className="text-xl font-semibold mb-2">Event Details</h3>

                        <label className="w-full text-left">Fountain:</label>
                        <div className="flex space-x-4">
                            <label><input type="radio" name="fountain" value="yes" checked={formData.fountain === "yes"} onChange={handleChange} /> Yes</label>
                            <label><input type="radio" name="fountain" value="no" checked={formData.fountain === "no"} onChange={handleChange} /> No</label>
                        </div>

                        <label className="w-full text-left">Poruwa Ceremony From:</label>
                        <input type="time" name="ceremonyFrom" value={formData.ceremonyFrom} onChange={handleChange} required className="w-full p-2 border rounded" />

                        <label className="w-full text-left">Poruwa Ceremony To:</label>
                        <input type="time" name="ceremonyTo" value={formData.ceremonyTo} onChange={handleChange} required className="w-full p-2 border rounded" />

                        <label className="w-full text-left">Registration Time:</label>
                        <input type="time" name="registrationTime" value={formData.registrationTime} onChange={handleChange} required className="w-full p-2 border rounded" />

                        <div className="flex justify-between w-full mt-3">
                            <button type="button" onClick={handleBack} className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600">Back</button>
                            <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">Submit</button>
                        </div>
                    </div>
                )}
            </form>
        </div>
    );
};

export default WeddingForm;
