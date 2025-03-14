const express = require('express');
const router = express.Router();
const PaymentService = require('../services/PaymentService');
const { AuthService } = require('../services');

// Admin routes
router.post('/methods',
    AuthService.authenticate,
    async (req, res) => {
        try {
            const paymentMethod = await PaymentService.createPaymentMethod(req.body, req.user.id);
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
            const paymentMethod = await PaymentService.updatePaymentMethod(req.body, req.params.id, req.user.id);
            res.status(201).json(paymentMethod);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
);

router.post('/types',
    AuthService.authenticate,
    async (req, res) => {
        try {
            const paymentType = await PaymentService.createPaymentType(req.body, req.user.id);
            res.status(201).json(paymentType);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
);

// User routes
router.get('/methods',
    AuthService.authenticate,
    async (req, res) => {
        try {
            const methods = await PaymentService.getAllPaymentMethods(req.user.id, req?.query?.status);
            res.json(methods);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
);

router.get('/methods/:methodId',
    AuthService.authenticate,
    async (req, res) => {
        try {
            const methods = await PaymentService.getSinglePaymentMethods(req.user.id, req?.params?.methodId);
            res.json(methods);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
);

router.get('/types/:methodId',
    AuthService.authenticate,
    async (req, res) => {
        try {
            const types = await PaymentService.getPaymentTypesByMethodId(req.params.methodId, req.user.id);
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

// Update payment type
router.post('/types/:id',
    AuthService.authenticate,
    async (req, res) => {
        try {
            const paymentType = await PaymentService.updatePaymentType(req.body, req.params.id, req.user.id);
            res.status(200).json(paymentType);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
);

// Get all payment types
router.get('/types',
    AuthService.authenticate,
    async (req, res) => {
        try {
            const types = await PaymentService.getAllPaymentTypes(req.user.id, req?.query?.status);
            res.json(types);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
);

// Get single payment type
router.get('/types/:typeId',
    AuthService.authenticate,
    async (req, res) => {
        try {
            const type = await PaymentService.getSinglePaymentType(req.user.id, req.params.typeId);
            res.json(type);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
);

module.exports = router; 