const PaymentService = require('../services/PaymentService');

class PaymentController {
    // ... existing methods ...

    async deletePaymentType(req, res) {
        try {
            const result = await PaymentService.deletePaymentType(req.params.id, req.user.id);
            res.json(result);
        } catch (error) {
            res.status(500).json({
                status: false,
                message: error.message
            });
        }
    }
}

module.exports = new PaymentController(); 