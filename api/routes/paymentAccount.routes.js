const express = require('express');
const router = express.Router();
const PaymentAccountController = require('../controllers/PaymentAccountController');
const { authenticateToken } = require('../middleware/auth');

// Apply authentication middleware to all routes
router.use(authenticateToken);

// Create a new payment account
router.post('/', PaymentAccountController.createPaymentAccount);

// Update an existing payment account
router.put('/:id', PaymentAccountController.updatePaymentAccount);

// Get all payment accounts
router.get('/', PaymentAccountController.getPaymentAccounts);

module.exports = router; 