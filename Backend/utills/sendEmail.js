const nodemailer = require('nodemailer');

const sendEmail = async (to, subject, text) => {
  try {
    // console.log(to, subject, text);
    
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
    console.log("to, subject, text",transporter);

    await transporter.sendMail({
      from: `"Freelance Marketplace" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
    });

    console.log(`✅ Email sent to ${to}`);
  } catch (error) {
    console.error('❌ Email sending failed:', error.message);
    throw new Error('Email not sent');
  }
};

module.exports = sendEmail;
