const express = require('express');
const router = express.Router();
const PaymentService = require('../services/PaymentService');
const { AuthService } = require('../services');

// Admin routes
router.post('/methods',
    AuthService.authenticate,
    async (req, res) => {
        try {
            const paymentMethod = await PaymentService.createPaymentMethod(req.body);
            res.status(201).json(paymentMethod);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
);

router.post('/methods/:id',
    AuthService.authenticate,
    async (req, res) => {
        try {
            const paymentMethod = await PaymentService.updatePaymentMethod(req.body, req.params.id);
            res.status(201).json(paymentMethod);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
);

router.post('/types',
    AuthService.isAdmin,
    async (req, res) => {
        try {
            const paymentType = await PaymentService.createPaymentType(req.body);
            res.status(201).json(paymentType);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
);

// User routes
router.get('/methods',
    async (req, res) => {
        try {
            const methods = await PaymentService.getAllPaymentMethods();
            res.json(methods);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
);

router.get('/types/:methodId',
    async (req, res) => {
        try {
            const types = await PaymentService.getPaymentTypesByMethodId(req.params.methodId);
            res.json(types);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
);

router.post('/transactions',
    AuthService.authenticate,
    async (req, res) => {
        try {
            const transaction = await PaymentService.createTransaction(req.user.id, req.body);
            res.status(201).json(transaction);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
);

router.get('/transactions',
    AuthService.authenticate,
    async (req, res) => {
        try {
            const transactions = await PaymentService.getUserTransactions(req.user.id);
            res.json(transactions);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
);

module.exports = router; 