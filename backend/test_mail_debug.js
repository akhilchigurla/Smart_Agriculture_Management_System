const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();

console.log('Using EMAIL_USER:', process.env.EMAIL_USER);
console.log('Configuring transporter...');

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, 
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  tls: {
    rejectUnauthorized: false
  },
  debug: true,
  logger: true
});

const mailOptions = {
  from: process.env.EMAIL_USER,
  to: process.env.EMAIL_USER,
  subject: 'Debug Test Mail',
  text: 'Testing SMTP with debug logs.'
};

console.log('Sending email...');
transporter.sendMail(mailOptions)
  .then(info => {
    console.log('Email sent successfully!');
    console.log('Response:', info.response);
    process.exit(0);
  })
  .catch(err => {
    console.error('FAILED to send email.');
    console.error('Error Name:', err.name);
    console.error('Error Message:', err.message);
    console.error('Error Code:', err.code);
    console.error('Error Command:', err.command);
    process.exit(1);
  });
