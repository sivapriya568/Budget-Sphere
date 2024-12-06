//backend/services/otpService
const nodemailer = require('nodemailer');
const crypto = require('crypto');
require('dotenv').config();

let otpStorage = {}; // Temporary in-memory storage for OTPs. Replace with a database in production.

const generateOTP = () => {
  return crypto.randomInt(100000, 999999).toString(); // 6-digit OTP
};

// Nodemailer transporter setup
const transporter = nodemailer.createTransport({
  service: 'gmail', // You can use other services like Outlook, Yahoo, etc.
  auth: {
    user: process.env.EMAIL, // Your email
    pass: process.env.EMAIL_PASSWORD, // Your email password or app-specific password
  },
});

// Function to send OTP email
const sendOtpEmail = async (email, otp) => {
  const mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: 'Your OTP Code',
    text: `Your OTP code is ${otp}. It is valid for 5 minutes.`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('OTP sent to:', email);
    return true;
  } catch (error) {
    console.error('Error sending OTP email:', error);
    return false;
  }
};

// Function to generate and send OTP
const generateAndSendOtp = async (email) => {
  const otp = generateOTP();
  const sent = await sendOtpEmail(email, otp);

  if (sent) {
    otpStorage[email] = { otp, expiresAt: Date.now() + 5 * 60 * 1000 }; // Store OTP with 5 minutes expiration
    return { success: true, message: 'OTP sent successfully!' };
  }

  return { success: false, message: 'Failed to send OTP. Please try again.' };
};

// Function to verify OTP
const verifyOtp = (email, userOtp) => {
  const storedOtpDetails = otpStorage[email];
  console.log(`Verifying OTP for ${email}, Input OTP: ${userOtp}, Stored OTP: ${storedOtpDetails?.otp}`);
  if (!storedOtpDetails) {
    return { success: false, message: 'OTP not found or expired.' };
  }

  const { otp, expiresAt } = storedOtpDetails;

  if (Date.now() > expiresAt) {
    delete otpStorage[email];
    return { success: false, message: 'OTP has expired.' };
  }

  if (userOtp === otp) {
    delete otpStorage[email]; // Clear OTP after successful verification
    console.log('OTP verified successfully.');
    return { success: true, message: 'OTP verified successfully!' };
  }
  
  console.log('Invalid OTP.');
  return {success:false,message:'Invalid OTP'};
};

module.exports = { generateAndSendOtp, verifyOtp };
// const nodemailer = require('nodemailer');
// const crypto = require('crypto');
// require('dotenv').config();

// let otpStorage = {}; // Temporary in-memory storage for OTPs. Replace with a database in production.

// const generateOTP = () => {
//   return crypto.randomInt(100000, 999999).toString(); // 6-digit OTP
// };

// // Nodemailer transporter setup
// const transporter = nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//     user: process.env.EMAIL, // Your email address
//     pass: process.env.EMAIL_PASSWORD, // Your app-specific password
//   },
// });

// // Function to send OTP email
// const sendOtpEmail = async (email, otp) => {
//   const mailOptions = {
//     from: process.env.EMAIL,
//     to: email,
//     subject: 'Your OTP Code',
//     text: `Your OTP code is ${otp}. It is valid for 5 minutes.`,
//   };

//   try {
//     await transporter.sendMail(mailOptions);
//     console.log('OTP sent to:', email);
//     return true;
//   } catch (error) {
//     console.error('Error sending OTP email:', error);
//     return false;
//   }
// };

// // Function to generate and send OTP
// const generateAndSendOtp = async (email) => {
//   const otp = generateOTP();
//   const sent = await sendOtpEmail(email, otp);

//   if (sent) {
//     otpStorage[email] = { otp, expiresAt: Date.now() + 5 * 60 * 1000 }; // Store OTP with 5 minutes expiration
//     return { success: true, message: 'OTP sent successfully!' };
//   }

//   return { success: false, message: 'Failed to send OTP. Please try again.' };
// };

// // Function to verify OTP
// const verifyOtp = (email, userOtp) => {
//   const storedOtpDetails = otpStorage[email];

//   if (!storedOtpDetails) {
//     return { success: false, message: 'OTP not found or expired.' };
//   }

//   const { otp, expiresAt } = storedOtpDetails;

//   if (Date.now() > expiresAt) {
//     delete otpStorage[email];
//     return { success: false, message: 'OTP has expired.' };
//   }

//   if (userOtp === otp) {
//     delete otpStorage[email]; // Clear OTP after successful verification
//     return { success: true, message: 'OTP verified successfully!' };
//   }

//   return { success: false, message: 'Invalid OTP.' };
// };

// module.exports = { generateAndSendOtp, verifyOtp };