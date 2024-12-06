const express = require('express');
const { generateAndSendOtp, verifyOtp } = require('../../services/otpService');
const router = express.Router();

// Route to generate and send OTP
router.post('/send-otp', async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ success: false, message: 'Email is required.' });
  }

  try {
    const result = await generateAndSendOtp(email);
    res.status(result.success ? 200 : 500).json(result);
  } catch (error) {
    console.error('Error in /send-otp route:', error);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
});

// Route to verify OTP
router.post('/verify-otp', async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ success: false, message: 'Email and OTP are required.' });
  }

  try {
    const result = verifyOtp(email, otp);

    if (result.success) {
      res.status(200).json(result); // OTP verified successfully
    } else {
      res.status(200).json(result); // Invalid OTP or expired
    }
  } catch (error) {
    console.error('Error in /verify-otp route:', error);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
});

module.exports = router;
