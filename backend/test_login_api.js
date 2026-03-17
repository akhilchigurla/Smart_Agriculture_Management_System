const axios = require('axios');

const testLogin = async () => {
  try {
    const res = await axios.post('http://localhost:5001/api/auth/login', {
      email: 'testuser@example.com',
      password: 'password123'
    });
    console.log('Login successful:', res.data);
  } catch (err) {
    console.error('Login failed:', err.response ? err.response.data : err.message);
  }
};

testLogin();
