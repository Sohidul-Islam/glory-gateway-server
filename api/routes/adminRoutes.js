const express = require('express');
const router = express.Router();
const { AuthService } = require('../services');
const { body, validationResult } = require('express-validator');

// Validation middleware
const validateAdminCreation = [
    body('fullName')
        .trim()
        .notEmpty()
        .withMessage('Full name is required')
        .isLength({ min: 2, max: 100 })
        .withMessage('Full name must be between 2 and 100 characters'),
    body('email')
        .trim()
        .notEmpty()
        .withMessage('Email is required')
        .isEmail()
        .withMessage('Invalid email format'),
    body('password')
        .trim()
        .notEmpty()
        .withMessage('Password is required')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long'),
    body('phone')
        .trim()
        .notEmpty()
        .withMessage('Phone number is required')
        .matches(/^[0-9+\-\s()]+$/)
        .withMessage('Invalid phone number format'),
    body('accountType')
        .optional()
        .isIn(['admin', 'super admin'])
        .withMessage('Invalid account type')
];

// Create or update admin
router.post('/create',
    AuthService.authenticate,
    AuthService.hasRole(['super admin']), // Only super admin can create/update admin
    validateAdminCreation,
    async (req, res) => {
        try {
            // Check for validation errors
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    status: false,
                    message: "Validation error",
                    errors: errors.array()
                });
            }

            const result = await AuthService.makeAdmin(req.body);
            res.status(result.status ? 200 : 400).json(result);
        } catch (error) {
            res.status(500).json({
                status: false,
                message: error.message || "Error processing request"
            });
        }
    }
);

module.exports = router; 