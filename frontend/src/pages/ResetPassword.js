import React, { useState } from "react";
import { sendOtp, validateEmail, validateOtp } from "../services/AuthService";
import { useNavigate } from 'react-router-dom';

const ResetPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [buttonText, setButtonText] = useState("Check your email");
  const [errorMessage, setErrorMessage] = useState(null);
  const [response, setResponse]  = useState();

  const handleCheckEmail = async () => {
    if (!email.trim()) {
      setErrorMessage("Please enter an email");
      return;
    }

    if (buttonText === "Check your email") {
      setButtonText("Validating...");
      setErrorMessage(null);
      try {
        const value = await validateEmail(email);
        setResponse(value);
        if (value.message === "Email not found") {
          setErrorMessage("Email not found. Please try again.");
          setButtonText("Check your email");
        } else {
          setErrorMessage(`Email is verified as a ${value.source_table}.`);
          setButtonText("Send OTP");
        }
      } catch (error) {
        setErrorMessage("Error validating email. Try again later.");
        setButtonText("Check your email");
      }
    }

    if (buttonText === "Send OTP") {
      setButtonText("Sending..")
      try {
        const sendOtpResponse = await sendOtp({ email });
        sessionStorage.setItem('otp-token', sendOtpResponse.token);
        console.log("sssssss::",sessionStorage.getItem('otp-token'))

        console.log(sendOtpResponse);

        let countdown = 180; // 3 minutes in seconds
        const formatTime = (seconds) => {
          const minutes = Math.floor(seconds / 60);
          const remainingSeconds = seconds % 60;
          return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
        };

        setButtonText(`Wait, ${formatTime(countdown)}`);
        const interval = setInterval(() => {
          countdown -= 1;
          if (countdown <= 0) {
            clearInterval(interval);
            setButtonText("Send OTP");
          } else {
            setButtonText(`Wait, ${formatTime(countdown)}`);
          }
        }, 1000);
        setButtonText("Send OTP");
      } catch (error) {
        setErrorMessage("Error sending OTP. Try again later.");
        setButtonText("Send OTP")
      } 
    }
  };

  const handleValidateOtp = async () => {
    //const mm = sessionStorage.getItem('otp-token');
    const data = {token:sessionStorage.getItem('otp-token'), otp:otp}

    try{
      const otpResponse = await validateOtp(data);
      setErrorMessage(otpResponse.message);
      sessionStorage.removeItem('otp-token');

      setButtonText("Check your email");

      setTimeout(() => {
        navigate('/forgot-password/update', { state: { email, sourceTable: response.source_table } });
      }, 3000); // Wait for 5 seconds before navigating
    } catch (error) {
      setErrorMessage("OTP is not valid!!");
    }

  }

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
        <input type="text" placeholder="OTP" value={otp} onChange={(e) => setOtp(e.target.value)} className="w-full p-2 border rounded mb-2" />
        <button
          className="w-full bg-green-500 text-white p-2 rounded"
          onClick={handleValidateOtp}
        >
          Verify OTP
        </button>
      </div>
    </div>
  );
};

export default ResetPassword;
