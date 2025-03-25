require('dotenv').config(); // Load environment variables

const mongoose = require('mongoose');

// MongoDB connection URI from environment variables
const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/Medical'; 

// Function to connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1); 
  }
};

module.exports = connectDB; // Export the function correctly
