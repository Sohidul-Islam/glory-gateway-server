const express = require('express');
const router = express.Router();
const PaymentController = require('../controllers/PaymentController');
const { authenticateToken } = require('../middleware/auth');

// Apply authentication middleware to all routes
router.use(authenticateToken);

// ... existing routes ...

// Delete a payment type
router.delete('/types/:id', PaymentController.deletePaymentType);

module.exports = router; 