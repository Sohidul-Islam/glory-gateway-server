const Banner = require('../entity/Banner');
const { Op } = require('sequelize');

class BannerService {
    async createBanner(userId, data) {
        const t = await sequelize.transaction();
        try {
            const banner = await Banner.create({
                userId,
                title: data.title,
                image: data.image,
                description: data.description,
                status: data.status || 'active',
                startDate: data.startDate,
                endDate: data.endDate
            }, { transaction: t });

            await t.commit();
            return {
                status: true,
                message: "Banner created successfully",
                data: banner
            };
        } catch (error) {
            await t.rollback();
            throw error;
        }
    }

    async updateBanner(bannerId, userId, data) {
        const t = await sequelize.transaction();
        try {
            const banner = await Banner.findOne({
                where: {
                    id: bannerId,
                    userId
                }
            });

            if (!banner) {
                return {
                    status: false,
                    message: "Banner not found"
                };
            }

            await banner.update({
                title: data.title,
                image: data.image,
                description: data.description,
                status: data.status,
                startDate: data.startDate,
                endDate: data.endDate
            }, { transaction: t });

            await t.commit();
            return {
                status: true,
                message: "Banner updated successfully",
                data: banner
            };
        } catch (error) {
            await t.rollback();
            throw error;
        }
    }

    async getUserBanners(userId) {
        try {
            const currentDate = new Date();
            const banners = await Banner.findAll({
                where: {
                    userId,
                    status: 'active',
                    [Op.or]: [
                        {
                            [Op.and]: [
                                { startDate: { [Op.lte]: currentDate } },
                                { endDate: { [Op.gte]: currentDate } }
                            ]
                        },
                        {
                            [Op.and]: [
                                { startDate: null },
                                { endDate: null }
                            ]
                        }
                    ]
                },
                order: [['createdAt', 'DESC']]
            });

            return {
                status: true,
                message: "Banners retrieved successfully",
                data: banners
            };
        } catch (error) {
            throw error;
        }
    }

    async deleteBanner(bannerId, userId) {
        const t = await sequelize.transaction();
        try {
            const banner = await Banner.findOne({
                where: {
                    id: bannerId,
                    userId
                }
            });

            if (!banner) {
                return {
                    status: false,
                    message: "Banner not found"
                };
            }

            await banner.update({ status: 'inactive' }, { transaction: t });

            await t.commit();
            return {
                status: true,
                message: "Banner deleted successfully"
            };
        } catch (error) {
            await t.rollback();
            throw error;
        }
    }
}

module.exports = new BannerService(); 