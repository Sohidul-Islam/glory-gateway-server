const express = require('express');
const router = express.Router();
const DashboardService = require('../services/DashboardService');
const { AuthService } = require('../services');

router.get('/overview',
    AuthService.authenticate,
    async (req, res) => {
        try {
            const result = await DashboardService.getOverviewStats(req.user.id, req.query);
            res.status(result.status ? 200 : 400).json(result);
        } catch (error) {
            res.status(500).json({
                status: false,
                message: error.message || 'Error retrieving overview statistics'
            });
        }
    }
);

module.exports = router; 