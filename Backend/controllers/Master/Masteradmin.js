const MasterAdmin = require("../../models/Master/MasterAdmin");
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const Tenant = require("../../models/Master/Tenant");
const createTenantDb = require("../../utills/createTenantDb");
const sendEmail = require("../../utills/sendEmail");
const crypto = require('crypto');
const Plane = require("../../models/Master/Plane");
const { json } = require("sequelize");



const MasterLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const Master = await MasterAdmin.findOne({ email });
    if (!Master) return res.json({ message: 'invalid email' })

    const match = await bcrypt.compare(password, Master.password)
    if (!match) return res.json({ message: 'invalid password' })

    const token = jwt.sign({ id: Master.id, email: Master.email }, process.env.TOKEN_SECRET, {
      expiresIn: "1h",
    });

    res.status(201).json({ message: "login succesfully", Master, token });
  }
  catch (error) {
    console.log(error);
    res.status(500).json({ message: "login failed" });
  }

}


const createTenant = async (req, res) => {
  try {
    const { name, email, companyName, planId } = req.body;

    const plane = await Plane.findOne({ where: { id: planId } });
    if (!plane) return res.json({ message: 'Plan not found' });

    // Generate 6-digit code
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Create tenant record
    const tenant = await Tenant.create({
      name,
      email,
      companyName,
      planId,
      verificationCode,
      codeExpiresAt: new Date(Date.now() + 10 * 60 * 1000), // expires in 10 minutes
      isVerified: false,
    });

    // Create tenant DB
    await createTenantDb(companyName);

    // Send OTP via email
    const message = `
      Dear ${name},
      
      Thank you for registering your company: ${companyName}.
      
      Your verification code is: ${verificationCode}
      
      This code will expire in 10 minutes.
      
      – Freelance Marketplace Team
    `;

    await sendEmail(email, 'Your Tenant Verification Code', message);

    res.status(201).json({
      message: 'Tenant created. Verification code sent to email.',
    });
  } catch (error) {
    res.status(500).json({
      message: 'Tenant creation error',
      error: error.message,
    });
  }
};

const verifyTenant = async (req, res) => {
  try {
    const { email, code } = req.body;

    const tenant = await Tenant.findOne({ where: { email } });

    console.log(tenant);

    if (!tenant) return res.status(404).json({ message: 'Tenant not found' });

    if (tenant.isVerified)
      return res.status(400).json({ message: 'Tenant already verified' });
    console.log(tenant.verificationCode, code);

    if (Number(tenant.verificationCode) !== code)
      return res.status(400).json({ message: 'Invalid verification code' });

    if (tenant.codeExpiresAt < new Date())
      return res.status(400).json({ message: 'Verification code expired' });

    tenant.isVerified = true;
    tenant.verificationCode = null;
    tenant.codeExpiresAt = null;
    await tenant.save();

    res.status(200).json({ message: 'Tenant verified successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Verification failed', error: error.message });
  }
};



const setPassword = async (req, res) => {
  try {
    const { email, password } = req.body;
    const tenant = await Tenant.findOne({ where: { email } });

    if (!tenant || !tenant.isVerified)
      return res.status(400).json({ message: 'Tenant not verified' });

    tenant.password = await bcrypt.hash(password, 10);
    await tenant.save();

    res.json({ message: 'Password set successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error setting password', error: error.message });
  }
};

module.exports = {
  MasterLogin,
  createTenant,
  verifyTenant,
  setPassword
}