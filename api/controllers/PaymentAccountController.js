const PaymentAccountService = require('../services/PaymentAccountService');

class PaymentAccountController {
    async createPaymentAccount(req, res) {
        try {
            const result = await PaymentAccountService.createPaymentAccount(req.body, req.user.id);
            res.json(result);
        } catch (error) {
            res.status(500).json({
                status: false,
                message: error.message
            });
        }
    }

    async updatePaymentAccount(req, res) {
        try {
            const result = await PaymentAccountService.updatePaymentAccount(
                req.body,
                req.params.id,
                req.user.id
            );
            res.json(result);
        } catch (error) {
            res.status(500).json({
                status: false,
                message: error.message
            });
        }
    }

    async getPaymentAccounts(req, res) {
        try {
            const result = await PaymentAccountService.getPaymentAccounts(req.user.id, req.query);
            res.json(result);
        } catch (error) {
            res.status(500).json({
                status: false,
                message: error.message
            });
        }
    }
}

module.exports = new PaymentAccountController(); 