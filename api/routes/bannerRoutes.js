const express = require('express');
const router = express.Router();
const BannerService = require('../services/BannerService');
const { AuthService } = require('../services');
const requestHandler = require('../utils/requestHandler');

// Create banner
router.post('/',
    AuthService.authenticate,
    requestHandler(null, async (req, res) => {
        const result = await BannerService.createBanner(req.user.id, req.body);
        res.status(result.status ? 201 : 400).json(result);
    })
);

// Update banner
router.put('/:id',
    AuthService.authenticate,
    requestHandler(null, async (req, res) => {
        const result = await BannerService.updateBanner(req.params.id, req.user.id, req.body);
        res.status(result.status ? 200 : 400).json(result);
    })
);

// Get user's banners
router.get('/',
    AuthService.authenticate,
    requestHandler(null, async (req, res) => {
        const result = await BannerService.getUserBanners(req.user.id);
        res.status(result.status ? 200 : 400).json(result);
    })
);

// Delete banner
router.delete('/:id',
    AuthService.authenticate,
    requestHandler(null, async (req, res) => {
        const result = await BannerService.deleteBanner(req.params.id, req.user.id);
        res.status(result.status ? 200 : 400).json(result);
    })
);

module.exports = router; 