const express = require('express');
const createUser  = require('../controller/usercontroller'); // Import the createUser function
const router = express.Router(); // Create an Express router

// Define a POST route to create a new user
// router.post('/User',function(req, res) {createUser.usercontroller(req,res)});
// router.post('/Userlogin',function(req, res) {createUser.loginController(req,res)});

router.post('/User', createUser.usercontroller);
router.post('/Userlogin', createUser.loginController);
router.post('/forget', createUser.forgetPasswordController);
router.post('/reset', createUser.resetPasswordController);


// Export the router
module.exports = router;

