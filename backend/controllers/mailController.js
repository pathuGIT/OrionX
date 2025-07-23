import sgMail from '@sendgrid/mail';
import dotenv from 'dotenv';
dotenv.config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export const sendIdToEmp = async (req, res) => {
  const { name, subject, email, message } = req.body;
  try {
    const msg = {
      to: email,
      from: 'noreply@deandrabolgoda.lk', // Must be verified in SendGrid
      subject,
      text: `Hello ${name},\n\n${message}`,
      html: `<p>Hello ${name},</p><p>${message}</p>`
    };
    await sgMail.send(msg);
    res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ msg: 'Server error...', error });
  }
};

export const sendIdToUserMethod = async (name, subject, email, message, url) => {
  try {
    const msg = {
      to: email,
      from: 'noreply@deandrabolgoda.lk',
      subject,
      text: `Hello ${name},\n\nID: ${message}\n\nBest regards,\nDeandra`,
      html: `
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; color: #333; background-color: #f9f9f9; padding: 20px; }
            .container { max-width: 600px; background: #fff; padding: 20px; margin: auto; border-radius: 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
            .header { text-align: center; font-size: 22px; font-weight: bold; color: #4A90E2; padding-bottom: 15px; border-bottom: 2px solid #ddd; }
            .content { padding: 20px; line-height: 1.6; font-size: 16px; }
            .footer { text-align: center; padding: 15px; font-size: 14px; color: #777; border-top: 2px solid #ddd; }
            .btn { display: inline-block; background-color: #4A90E2; color: #fff; padding: 10px 15px; text-decoration: none; border-radius: 5px; font-weight: bold; }
            .btn:hover { background-color: #357ABD; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">Deandra Notification</div>
            <div class="content">
              <p>Hello <strong>${name}</strong>,</p>
              <p>Your requested ID is: <strong>${message}</strong></p>
              <p>Use the following Link to register & use this ID:</p>
              <a href="${url}" class="btn">Register Now</a>
            </div>
            <div class="footer">Best regards,<br/>Deandra Team</div>
          </div>
        </body>
      </html>
      `
    };
    await sgMail.send(msg);
    console.log('User ID email sent');
  } catch (error) {
    console.error('Mail Server error...', error);
  }
};

export const sendOtpEmail = async (email, otp) => {
  try {
    const msg = {
      to: email,
      from: 'noreply@deandrabolgoda.lk',
      subject: 'Your OTP Code',
      text: `Hello, Your OTP is: ${otp} Best regards, Deandra`,
      html: `
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; color: #333; background-color: #f9f9f9; padding: 20px; }
            .container { max-width: 600px; background: #fff; padding: 20px; margin: auto; border-radius: 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
            .header { text-align: center; font-size: 22px; font-weight: bold; color: #4A90E2; padding-bottom: 15px; border-bottom: 2px solid #ddd; }
            .content { padding: 20px; line-height: 1.6; font-size: 16px; }
            .footer { text-align: center; padding: 15px; font-size: 14px; color: #777; border-top: 2px solid #ddd; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">Deandra Notification</div>
            <div class="content">
              <p>Hello,</p>
              <p>Your OTP is: <strong>${otp}</strong></p>
              <p>Please use this OTP to complete your verification process.</p>
            </div>
            <div class="footer">Best regards,<br/>Deandra Team</div>
          </div>
        </body>
      </html>
      `
    };
    await sgMail.send(msg);
    console.log('OTP email sent');
  } catch (error) {
    console.error('Error sending OTP email:', error);
    throw new Error('Mail Server error');
  }
};
