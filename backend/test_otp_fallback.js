const axios = require('axios');

async function testOtpFallback() {
  const email = 'test_' + Date.now() + '@example.com';
  console.log(`Testing OTP fallback for ${email}...`);

  try {
    const response = await axios.post('http://localhost:5001/api/auth/send-otp', { email });
    console.log('Status Code:', response.status);
    console.log('Response Data:', response.data);

    if (response.data.fallback) {
      console.log('SUCCESS: Fallback logic triggered as expected.');
    } else {
      console.log('INFO: OTP sent successfully (or SMTP didn\'t fail as expected).');
    }
  } catch (error) {
    if (error.response) {
      console.error('FAILED: Server returned error:', error.response.status, error.response.data);
    } else {
      console.error('FAILED: Request error:', error.message);
    }
  }
}

// Note: Ensure the backend server is running before executing this
testOtpFallback();
