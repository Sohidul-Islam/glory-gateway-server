const express = require('express');
const router = express.Router();
const NotificationService = require('../services/NotificationService');
const { AuthService } = require('../services');

// Get user notifications
router.get('/',
    AuthService.authenticate,
    async (req, res) => {
        try {
            const result = await NotificationService.getUserNotifications(req.user.id, req.query);
            res.status(result.status ? 200 : 400).json(result);
        } catch (error) {
            res.status(500).json({
                status: false,
                message: error.message || 'Error retrieving notifications'
            });
        }
    }
);

// Mark notifications as read
router.post('/mark-read',
    AuthService.authenticate,
    async (req, res) => {
        try {
            const result = await NotificationService.markAsRead(
                req.user.id,
                req.body.notificationIds // Optional, if not provided, mark all as read
            );
            res.status(result.status ? 200 : 400).json(result);
        } catch (error) {
            res.status(500).json({
                status: false,
                message: error.message || 'Error marking notifications as read'
            });
        }
    }
);
router.post('/mark-read/:notificationId',
    AuthService.authenticate,
    async (req, res) => {
        try {
            const result = await NotificationService.markAsRead(
                req.user.id,
                req.body.notificationIds // Optional, if not provided, mark all as read
            );
            res.status(result.status ? 200 : 400).json(result);
        } catch (error) {
            res.status(500).json({
                status: false,
                message: error.message || 'Error marking notifications as read'
            });
        }
    }
);

// Delete notifications
router.post('/delete-notification',
    AuthService.authenticate,
    async (req, res) => {
        try {
            const result = await NotificationService.deleteNotifications(
                req.user.id,
                req.body.notificationIds // Optional, if not provided, delete all
            );
            res.status(result.status ? 200 : 400).json(result);
        } catch (error) {
            res.status(500).json({
                status: false,
                message: error.message || 'Error deleting notifications'
            });
        }
    }
);

// Get unread count
router.get('/unread-count',
    AuthService.authenticate,
    async (req, res) => {
        try {
            const unreadCount = await NotificationService.getUnreadCount(req.user.id);
            res.status(200).json({
                status: true,
                message: 'Unread count retrieved successfully',
                data: { unreadCount }
            });
        } catch (error) {
            res.status(500).json({
                status: false,
                message: error.message || 'Error retrieving unread count'
            });
        }
    }
);

module.exports = router; 