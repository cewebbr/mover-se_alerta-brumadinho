const express = require('express');
const router = express.Router();
const loginController = require('../controllers/login');

// Log in a user
router.post('/auth', loginController.auth);

// Generates the password reset token
router.post('/forgotPassword', loginController.forgotPassword);

// Validates the password reset token
router.post('/confirmToken', loginController.confirmToken);

// Resets the user's password
router.put('/redefinePassword', loginController.redefinePassword);

// Returns a user by its authentication token
router.get('/getUser/:token', loginController.getUserFromToken);

module.exports = router;
