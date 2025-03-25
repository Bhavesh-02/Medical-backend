const User = require('../model/usermodel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();  
const nodemailer = require('nodemailer');

// Controller function to create a user
exports.usercontroller = async (req, res) => {
  try {
    const { name, email, password, number } = req.body;

    // Password strength validation (optional but recommended)
    if (password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters long.' });
    }

    // Hash the password before saving the user
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user instance and save it to the database
    const newUser = new User({ name, email, password: hashedPassword, number });
    console.log(newUser);  

    await newUser.save();  // Save the new user to the 'users' collection

    res.status(201).json({ message: 'User created successfully!' });
  } catch (error) {
    console.error(error.message);  
    res.status(400).json({ error: error.message });
  }
};

// Controller function to log in a user
exports.loginController = async (req, res) => {
  console.log("Login attempt");  
  try {
    const { email, password } = req.body;

    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User not found!' });
    }

    // Compare the password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials!' });
    }

    // Generate a JWT token 
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET_KEY,  // Use the secret key from environment variables
      { expiresIn: '5h' }  // Optional: Set token expiration time
    );
    
    console.log(user);

    // Send response with token and success message
    res.status(200).json({
      message: 'Login successful!',
      token,  // Send the token to the client
    });
    } catch (error) {
    console.error(error.message);  // Improved error logging
    res.status(500).json({ error: 'Server error. Please try again later.' });
  }
};


// IMP stored the otp in a temp 
// Logic- otp genration and stored and smtp
let generatedOtp = null;

function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000);  // Generates a 6-digit OTP
}

// Helper function to send OTP to the user's email
async function sendOtpEmail(email, otp) {
  // Using Mailtrap SMTP configuration for email transport
  const transporter = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
          user: process.env.EMAIL_USER,  
          pass: process.env.EMAIL_PASS 
      }
  });

  const mailOptions = {
      from: process.env.EMAIL_USER,  
      to: email,  
      subject: 'Password Reset OTP',
      text: `Your OTP for resetting your password is: ${otp}`,
  };

  return transporter.sendMail(mailOptions);
}

exports.forgetPasswordController = async (req, res) => {
  const { email } = req.body;  // Extract email from the request body

  try {
      // Log the received email to ensure the correct data is received
      console.log('Received email:', email);

      // Check if the user exists in the database
      const user = await User.findOne({ email });
      if (!user) {
          console.log('User not found for email:', email);
          return res.status(404).json({
              success: false,
              error: 'User not found',
          });
      }

      // Generate OTP (6 digits)
      generatedOtp = generateOtp();

      

      // Send OTP to the user's email using Mailtrap
      await sendOtpEmail(email, generatedOtp);


      // Respond back with a message, don't specify if the email exists for security
      res.status(200).json({
          success: true,
          message: 'If the email exists, an OTP has been sent to reset your password.',
      });
  } catch (error) {
      console.error('Error in forgotPasswordController:', error);
      res.status(500).json({
          success: false,
          error: error.message,
      });
  }};


exports.resetPasswordController = async (req, res) => {
    const { otp, newPassword, email } = req.body;
  
    try {
      // Check if OTP is valid
      if (parseInt(otp) !== generatedOtp) {
        return res.status(400).json({ error: 'Invalid OTP!' });
      }
  
      // Find the user by email
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ error: 'User not found!' });
      }
  
      // Ensure new password doesn't match the old one
      const isMatch = await bcrypt.compare(newPassword, user.password);
      if (isMatch) {
        return res.status(400).json({ error: 'New password cannot be the same as the old password.' });
      }
  
      // Hash the new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);
  
      // Update the user's password
      user.password = hashedPassword;
      await user.save();
  
      // Clear OTP (security)
      generatedOtp = null;
  
      res.status(200).json({ message: 'Password has been reset successfully!' });
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ error: 'Server error. Please try again later.' });
    }
  };




