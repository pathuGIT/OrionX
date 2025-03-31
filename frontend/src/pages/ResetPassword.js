import React, { useState } from "react";


const ResetPassword = () => {
  const [mail, setMail] = useState({ email: '' });
  const [toggolename, setTogglename] = useState('Check your email')

  const hadleToggleBtn = () => {
    setTogglename('Validating...');
    setTimeout(() => {
      
      setTogglename('Check your email');
    }, 1000);
  }
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setMail((prevMail) => ({
      ...prevMail,
      [name]: value,
    }));
  };

  return (
    <div>
      <h2>ResetPassword</h2>
      <form className=' border my-3'>
        <table>
          <tbody>
            <tr>
              <td>
                <input type="email" id="email" name="email" value={mail.email} onChange={handleChange} className='border' required placeholder='Enter Email' />
              </td>
            </tr>
            <tr>
              <td colSpan="2">
                <a href="#" className=' underline' onClick={() => hadleToggleBtn()}>{toggolename}</a>
              </td>
            </tr>
            <tr>
              <td>
                <input type="text" id="otp" name="otp" className='border' placeholder='OTP' required />
              </td>
            </tr>
            <tr>
              <td colSpan="2">
                <button type="button" className=' border px-2 py-1 bg-blue-500' onClick={() => alert('OTP Verified!')}>Verify</button>
              </td>
            </tr>
          </tbody>
        </table>
      </form>
    </div>
  )
}

export default ResetPassword