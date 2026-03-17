const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

async function testAIDetection() {
    const filePath = path.join(__dirname, 'test_crop.jpg');
    // Create a dummy image file for testing if it doesn't exist
    if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, Buffer.from('dummy image data'));
    }

    const form = new FormData();
    form.append('image', fs.createReadStream(filePath));

    try {
        console.log('Sending AI Detection request...');
        const response = await axios.post('http://localhost:5001/api/disease/detect', form, {
            headers: form.getHeaders(),
        });
        console.log('Response received:', JSON.stringify(response.data, null, 2));
    } catch (error) {
        console.error('Error during AI detection:', error.response?.data || error.message);
    }
}

testAIDetection();
