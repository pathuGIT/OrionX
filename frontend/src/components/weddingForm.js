import React, { useState } from "react";
import axios from "axios";
import "./weddingForm.css"; // Ensure you create this CSS file for styling

const WeddingForm = () => {
    const [formData, setFormData] = useState({
        eventId: "",
        groomName: "",
        brideName: "",
        groomContact: "",
        brideContact: "",
        fountain: false,
        prosperityTable: false,
        groomAddress: "",
        brideAddress: "",
        ceremonyFrom: "",
        ceremonyTo: "",
        registrationTime: "",
    });

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    // Handle input change
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === "checkbox" ? checked : value,
        });
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");
        setError("");

        try {
            const response = await axios.post("http://localhost:8000/api/weddings", formData);
            setMessage(response.data.message);
            setFormData({
                eventId: "",
                groomName: "",
                brideName: "",
                groomContact: "",
                brideContact: "",
                fountain: false,
                prosperityTable: false,
                groomAddress: "",
                brideAddress: "",
                ceremonyFrom: "",
                ceremonyTo: "",
                registrationTime: "",
            });
        } catch (err) {
            setError(err.response?.data?.error || "An error occurred while creating the wedding.");
        }
    };

    return (
        <div className="wedding-form">
            <h2>Create Wedding Event</h2>
            {message && <p className="success">{message}</p>}
            {error && <p className="error">{error}</p>}
            <form onSubmit={handleSubmit}>
                <label>Event ID:</label>
                <input type="number" name="eventId" value={formData.eventId} onChange={handleChange} required />

                <label>Groom Name:</label>
                <input type="text" name="groomName" value={formData.groomName} onChange={handleChange} required />

                <label>Bride Name:</label>
                <input type="text" name="brideName" value={formData.brideName} onChange={handleChange} required />

                <label>Groom Contact No:</label>
                <input type="text" name="groomContact" value={formData.groomContact} onChange={handleChange} required />

                <label>Bride Contact No:</label>
                <input type="text" name="brideContact" value={formData.brideContact} onChange={handleChange} required />

                <label>Fountain:</label>
                <input type="checkbox" name="fountain" checked={formData.fountain} onChange={handleChange} />

                <label>Prosperity Table:</label>
                <input type="checkbox" name="prosperityTable" checked={formData.prosperityTable} onChange={handleChange} />

                <label>Groom Address:</label>
                <input type="text" name="groomAddress" value={formData.groomAddress} onChange={handleChange} required />

                <label>Bride Address:</label>
                <input type="text" name="brideAddress" value={formData.brideAddress} onChange={handleChange} required />

                <label>Poruwa Ceremony From:</label>
                <input type="time" name="ceremonyFrom" value={formData.ceremonyFrom} onChange={handleChange} required />

                <label>Poruwa Ceremony To:</label>
                <input type="time" name="ceremonyTo" value={formData.ceremonyTo} onChange={handleChange} required />

                <label>Registration Time:</label>
                <input type="datetime-local" name="registrationTime" value={formData.registrationTime} onChange={handleChange} required />

                <button type="submit">Create Wedding Event</button>
            </form>
        </div>
    );
};

export default WeddingForm;
