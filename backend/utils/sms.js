const axios = require('axios');

/**
 * Send SMS using Africa's Talking API (popular in Kenya)
 * You can also use other SMS gateways like Twilio
 */
const sendSMS = async (options) => {
  try {
    // Africa's Talking API endpoint
    const apiUrl = 'https://api.africastalking.com/version1/messaging';
    
    const data = {
      username: process.env.SMS_USERNAME,
      to: options.to,
      message: options.message,
      from: process.env.SMS_SENDER_ID
    };

    const config = {
      headers: {
        'apiKey': process.env.SMS_API_KEY,
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
      }
    };

    const response = await axios.post(apiUrl, new URLSearchParams(data), config);
    
    console.log('SMS sent successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error sending SMS:', error.response?.data || error.message);
    throw error;
  }
};

module.exports = { sendSMS };
