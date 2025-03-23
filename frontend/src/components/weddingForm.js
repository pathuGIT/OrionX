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
    const [step, setStep] = useState(1); // Step tracker (1=Groom, 2=Bride, 3=Event)

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === "checkbox" ? checked : value,
        });
    };

    const handleNext = () => {
        setStep(step + 1);
    };

    const handleBack = () => {
        setStep(step - 1);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        alert("Wedding created successfully!");
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
            setStep(1); // Reset to first step
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
                {step === 1 && (
                    <div className="form-section">
                        <h3>Groom Details</h3>
                        <label>Event ID:</label>
                        <input type="number" name="eventId" value={formData.eventId} onChange={handleChange} required />

                        <label>Groom Name:</label>
                        <input type="text" name="groomName" value={formData.groomName} onChange={handleChange} required />

                        <label>Groom Contact No:</label>
                        <input type="text" name="groomContact" value={formData.groomContact} onChange={handleChange} required />

                        <label>Groom Address:</label>
                        <input type="text" name="groomAddress" value={formData.groomAddress} onChange={handleChange} required />

                        <button type="button" onClick={handleNext}>Next</button>
                    </div>
                )}

                {step === 2 && (
                    <div className="form-section">
                        <h3>Bride Details</h3>
                        <label>Bride Name:</label>
                        <input type="text" name="brideName" value={formData.brideName} onChange={handleChange} required />

                        <label>Bride Contact No:</label>
                        <input type="text" name="brideContact" value={formData.brideContact} onChange={handleChange} required />

                        <label>Bride Address:</label>
                        <input type="text" name="brideAddress" value={formData.brideAddress} onChange={handleChange} required />

                        <button type="button" onClick={handleBack}>Back</button>
                        <button type="button" onClick={handleNext}>Next</button>
                    </div>
                )}

                {step === 3 && (
                    <div className="form-section">
                        <h3>Event Details</h3>
                        <label>Fountain:</label>
                        <div className="radio-group">
                            
                            Yes  <input type="radio" name="fountain"  value="yes" checked={formData.fountain === "yes"} onChange={handleChange}/> 
                            No  <input type="radio" name="fountain"  value="no" checked={formData.fountain === "no"} onChange={handleChange}/>
                           
                        </div>

                        <label>Prosperity Table:</label>
                        <div className="radio-group">
                            
                            Yes  <input type="radio" name="prosperityTable"  value="yes" checked={formData.prosperityTable === "yes"} onChange={handleChange}/> 
                            No  <input type="radio" name="prosperityTable"  value="no" checked={formData.prosperityTable === "no"} onChange={handleChange}/>
                           
                        </div>

                        <label>Poruwa Ceremony From:</label>
                        <input type="time" name="ceremonyFrom" value={formData.ceremonyFrom} onChange={handleChange} required />

                        <label>Poruwa Ceremony To:</label>
                        <input type="time" name="ceremonyTo" value={formData.ceremonyTo} onChange={handleChange} required />

                        <label>Registration Time:</label>
                        <input type="time" name="registrationTime" value={formData.registrationTime} onChange={handleChange} required />

                        <button type="button" onClick={handleBack}>Back</button>
                        <button type="submit">Submit</button>
                    </div>
                )}
            </form>
        </div>
    );
};

export default WeddingForm;
