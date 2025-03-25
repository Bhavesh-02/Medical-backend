// models/userModel.js
const mongoose = require('mongoose');


// Define the schema for the user
const Userschema = new mongoose.Schema({

  name: { 
        type: String, 
        required: true },
  email: { 
        type: String, 
        required: true, 
        unique: true },
  password: { 
        type: String, 
        required: true,
        minlength: 8},      
  number: { 
        type: String, 
        required: true},
},
{timestamps : true}
   
);
// Create the model from the schema
const usermodel = mongoose.model('User', Userschema);

module.exports= usermodel;


