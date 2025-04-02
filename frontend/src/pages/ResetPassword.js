import React, { useState } from "react";
import { validateEmail } from "../services/AuthService";

const ResetPassword = () => {
  const [email, setEmail] = useState("");
  const [buttonText, setButtonText] = useState("Check your email");
  const [errorMessage, setErrorMessage] = useState(null);

  const handleCheckEmail = async () => {
    if (!email.trim()) {
      setErrorMessage("Please enter an email");
      return;
    }

    setButtonText("Validating...");
    setErrorMessage(null);

    try {
      const response = await validateEmail(email); // Pass email as a string
      if (response.message === "Email not found") {
        setErrorMessage("Email not found. Please try again.");
      } else {
        alert(`Email found in: ${response.source_table}`);
        setButtonText("Send OTP");
        if(buttonText === "Send OTP"){
          // send otp to email serive call
          
          
        }
      }
    } catch (error) {
      setErrorMessage("Error validating email. Try again later.");
    } finally {
      //setButtonText("Check your email");
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Reset Password</h2>
      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full p-2 border rounded mb-2"
      />
      {errorMessage && <p className="text-red-500">{errorMessage}</p>}
      <button
        onClick={handleCheckEmail}
        className="w-full bg-blue-500 text-white p-2 rounded"
      >
        {buttonText}
      </button>

      {/* OTP Section */}
      <div className="mt-4">
        <input type="text" placeholder="OTP" className="w-full p-2 border rounded mb-2" />
        <button
          className="w-full bg-green-500 text-white p-2 rounded"
          onClick={() => alert("OTP Verified!")}
        >
          Verify OTP
        </button>
      </div>
    </div>
  );
};

export default ResetPassword;
