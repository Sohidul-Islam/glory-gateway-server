const { Product, ProductVariant, Color, Size } = require('../entity');
const { Op, Sequelize } = require('sequelize');
const sequelize = require('sequelize');
const Notification = require('../entity/Notification');

const NotificationService = {
    async getStockAlerts(userId) {
        try {
            // Get products with low or out of stock (only those without variants)
            const products = await Product.findAll({
                where: {
                    UserId: userId,
                    [Op.or]: [
                        {
                            stock: { [Op.lte]: Sequelize.col('Product.alertQuantity') }
                        },
                        {
                            stock: 0
                        }
                    ]
                },
                include: [{
                    model: ProductVariant,
                    attributes: [],  // We only need this for counting
                    required: false
                }],
                attributes: [
                    'id',
                    'name',
                    'sku',
                    'stock',
                    'alertQuantity',
                    [Sequelize.fn('COUNT', Sequelize.col('ProductVariants.id')), 'variantCount']
                ],
                group: [
                    'Product.id'
                ],
                having: Sequelize.literal('COUNT(ProductVariants.id) = 0')
            });

            // Get products with variants that have low or out of stock
            const productsWithVariants = await Product.findAll({
                where: {
                    UserId: userId
                },
                attributes: ['id', 'name'],
                include: [{
                    model: ProductVariant,
                    separate: true, // This will perform a separate query for variants
                    where: {
                        [Op.or]: [
                            {
                                quantity: { [Op.lte]: Sequelize.col('ProductVariant.alertQuantity') }
                            },
                            {
                                quantity: 0
                            }
                        ]
                    },
                    include: [
                        {
                            model: Color,
                            attributes: ['name'],
                            required: false
                        },
                        {
                            model: Size,
                            attributes: ['name'],
                            required: false
                        }
                    ],
                    attributes: [
                        'id',
                        'sku',
                        'quantity',
                        'alertQuantity'
                    ]
                }]
            });

            // Format notifications
            const notifications = [
                // Product notifications (for products without variants)
                ...products.map(product => ({
                    type: 'product',
                    id: product.id,
                    name: product.name,
                    sku: product.sku,
                    currentStock: product.stock,
                    alertQuantity: product.alertQuantity,
                    status: product.stock === 0 ? 'out_of_stock' : product.stock <= product.alertQuantity ? 'low_stock' : 'available',
                    message: product.stock === 0
                        ? `${product.name} is out of stock!`
                        : `${product.name} is running low on stock (${product.stock} remaining)`
                })),

                // Variant notifications
                ...productsWithVariants.flatMap(product =>
                    (product.ProductVariants || []).map(variant => ({
                        type: 'variant',
                        productId: product.id,
                        variantId: variant.id,
                        name: `${product.name} (${variant.Color?.name || ''} - ${variant.Size?.name || ''})`,
                        sku: variant.sku,
                        currentStock: variant.quantity,
                        alertQuantity: variant.alertQuantity,
                        status: variant.quantity === 0 ? 'out_of_stock' : variant.quantity <= variant.alertQuantity ? 'low_stock' : 'available',
                        message: variant.quantity === 0
                            ? `${product.name} (${variant.Color?.name || ''} - ${variant.Size?.name || ''}) is out of stock!`
                            : `${product.name} (${variant.Color?.name || ''} - ${variant.Size?.name || ''}) is running low on stock (${variant.quantity} remaining)`
                    }))
                )
            ].filter((item) => item?.status !== "available");

            // Sort notifications (out of stock first, then low stock)
            notifications.sort((a, b) => {
                if (a.status === 'out_of_stock' && b.status !== 'out_of_stock') return -1;
                if (a.status !== 'out_of_stock' && b.status === 'out_of_stock') return 1;
                return a.currentStock - b.currentStock;
            });

            // Add summary
            const summary = {
                totalAlerts: notifications.length,
                outOfStock: notifications.filter(n => n.status === 'out_of_stock').length,
                lowStock: notifications.filter(n => n.status === 'low_stock').length
            };

            return {
                status: true,
                message: "Stock alerts retrieved successfully",
                data: {
                    summary,
                    notifications
                }
            };

        } catch (error) {
            console.error(error);
            return {
                status: false,
                message: "Failed to retrieve stock alerts",
                error: error.message
            };
        }
    },

    async getUnreadNotificationCount(userId) {
        try {
            const { data } = await this.getStockAlerts(userId);
            return {
                status: true,
                data: {
                    count: data.summary.totalAlerts
                }
            };
        } catch (error) {
            return {
                status: false,
                message: "Failed to get notification count",
                error: error.message
            };
        }
    },

    /**
     * Create a notification for a user
     */
    async createNotification(data) {
        try {
            const notification = await Notification.create({
                userId: data.userId,
                type: data.type || 'info',
                title: data.title,
                message: data.message,
                relatedEntityType: data.relatedEntityType,
                relatedEntityId: data.relatedEntityId
            });

            return {
                status: true,
                message: 'Notification created successfully',
                data: notification
            };
        } catch (error) {
            return {
                status: false,
                message: error.message || 'Error creating notification',
                error: error
            };
        }
    },

    /**
     * Get user notifications with pagination and filters
     */
    async getUserNotifications(userId, query) {
        try {
            const {
                page = 1,
                limit = 10,
                type,
                read,
                startDate,
                endDate,
                search
            } = query;

            // Calculate offset
            const offset = (page - 1) * limit;

            // Build where clause
            const whereClause = {
                userId,
                ...(type && { type }),
                ...(read !== undefined && { read: read === 'true' }),
                ...(startDate && endDate && {
                    createdAt: {
                        [Op.between]: [
                            new Date(startDate),
                            new Date(endDate)
                        ]
                    }
                }),
                ...(search && {
                    [Op.or]: [
                        { title: { [Op.like]: `%${search}%` } },
                        { message: { [Op.like]: `%${search}%` } }
                    ]
                })
            };

            // Get total count for pagination
            const total = await Notification.count({
                where: whereClause
            });

            // Calculate total pages
            const totalPages = Math.ceil(total / limit);

            // Get notifications with pagination and filters
            const notifications = await Notification.findAll({
                where: whereClause,
                order: [['createdAt', 'DESC']],
                limit: parseInt(limit),
                offset: parseInt(offset)
            });

            // Format timestamp for response
            const formattedNotifications = notifications.map(notification => ({
                id: notification.id,
                type: notification.type,
                title: notification.title,
                message: notification.message,
                timestamp: this.formatTimestamp(notification.createdAt),
                read: notification.read,
                relatedEntityType: notification.relatedEntityType,
                relatedEntityId: notification.relatedEntityId
            }));

            return {
                status: true,
                message: 'Notifications retrieved successfully',
                data: {
                    notifications: formattedNotifications,
                    pagination: {
                        total,
                        totalPages,
                        currentPage: parseInt(page),
                        limit: parseInt(limit),
                        hasNextPage: page < totalPages,
                        hasPrevPage: page > 1
                    },
                    unreadCount: await this.getUnreadCount(userId)
                }
            };
        } catch (error) {
            return {
                status: false,
                message: error.message || 'Error retrieving notifications',
                error: error
            };
        }
    },

    /**
     * Get count of unread notifications
     */
    async getUnreadCount(userId) {
        try {
            return await Notification.count({
                where: {
                    userId,
                    read: false
                }
            });
        } catch (error) {
            throw error;
        }
    },

    /**
     * Mark notifications as read
     */
    async markAsRead(userId, notificationIds) {
        try {
            let whereClause = { userId };

            // If notification IDs are provided, only mark those as read
            if (notificationIds && notificationIds.length > 0) {
                whereClause.id = {
                    [Op.in]: notificationIds
                };
            }

            await Notification.update(
                { read: true },
                { where: whereClause }
            );

            return {
                status: true,
                message: notificationIds ? 'Notifications marked as read' : 'All notifications marked as read',
                data: {
                    unreadCount: await this.getUnreadCount(userId)
                }
            };
        } catch (error) {
            return {
                status: false,
                message: error.message || 'Error marking notifications as read',
                error: error
            };
        }
    },

    /**
     * Delete notifications
     */
    async deleteNotifications(userId, notificationIds) {
        try {
            let whereClause = { userId };

            // If notification IDs are provided, only delete those
            if (notificationIds && notificationIds.length > 0) {
                whereClause.id = {
                    [Op.in]: notificationIds
                };
            }

            await Notification.destroy({
                where: whereClause
            });

            return {
                status: true,
                message: notificationIds ? 'Notifications deleted' : 'All notifications deleted',
                data: null
            };
        } catch (error) {
            return {
                status: false,
                message: error.message || 'Error deleting notifications',
                error: error
            };
        }
    },

    /**
     * Format timestamp to "YYYY-MM-DD HH:MM" format
     */
    formatTimestamp(date) {
        const d = new Date(date);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        const hours = String(d.getHours()).padStart(2, '0');
        const minutes = String(d.getMinutes()).padStart(2, '0');

        return `${year}-${month}-${day} ${hours}:${minutes}`;
    }
};

module.exports = NotificationService; 