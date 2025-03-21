const express = require('express');
const { CategoryService } = require('../services');
const { AuthService } = require('../services');
const requestHandler = require('../utils/requestHandler');

const router = express.Router();

router.post('/', AuthService.authenticate, requestHandler(null, async (req, res) => {
    const UserId = req?.user?.id || null;
    const result = await CategoryService.create({ ...req.body }, UserId);
    res.status(result.status ? 201 : 400).json(result);
}));

router.get('/', AuthService.authenticate, requestHandler(null, async (req, res) => {
    const result = await CategoryService.getAll(req.query, req.user.id);
    res.status(result.status ? 200 : 400).json(result);
}));

router.get('/:id', AuthService.authenticate, requestHandler(null, async (req, res) => {
    const result = await CategoryService.getById(req.params.id, req.user.id);
    res.status(result.status ? 200 : 404).json(result);
}));

router.post('/update/:id', AuthService.authenticate, requestHandler(null, async (req, res) => {
    const result = await CategoryService.update(req.params.id, req.body, req?.user?.id);
    res.status(result.status ? 200 : 400).json(result);
}));

router.post('/delete/:id', AuthService.authenticate, requestHandler(null, async (req, res) => {
    const result = await CategoryService.delete(req.params.id, req?.user?.id);
    res.status(result.status ? 200 : 400).json(result);
}));

module.exports = router; 