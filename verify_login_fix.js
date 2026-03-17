const axios = require('axios');

const API_URL = 'http://localhost:5001/api/auth';

async function verifyLoginFix() {
    console.log('--- Verifying Login Fix ---');
    
    const testEmail = 'FixTest' + Date.now() + '@Example.Com';
    const testPassword = 'Password123';
    
    try {
        // 1. Register a user (Mocked OTP bypass might be needed or I use a direct DB insert)
        // Since I'm an agent, I can use the existing registration flow if it's easy, 
        // but for verification of the FIX, I'll just check if an existing user can login with different cases.
        
        console.log('Step 1: Testing login with mismatched case...');
        // We know 'test@gmail.com' exists (or we can use 'testuser@gmail.com' from previous step)
        // Let's try logging in as 'TEST@GMAIL.COM' for 'test@gmail.com'
        
        const loginRes = await axios.post(`${API_URL}/login`, {
            email: 'TEST@GMAIL.COM',
            password: 'password123'
        });
        
        if (loginRes.status === 200) {
            console.log('SUCCESS: Login worked with mismatched email case!');
            console.log('User Role:', loginRes.data.user.role);
            if (loginRes.data.user.password) {
                console.error('FAILURE: Password was found in the response!');
            } else {
                console.log('SUCCESS: Password was correctly removed from the response.');
            }
        } else {
            console.error('FAILURE: Login failed with status', loginRes.status);
        }
        
    } catch (err) {
        console.error('ERROR during verification:', err.response?.data || err.message);
    }
}

verifyLoginFix();
