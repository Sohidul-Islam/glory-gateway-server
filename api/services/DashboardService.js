const { Op, Sequelize } = require('sequelize');
const Transaction = require('../entity/Transaction');
const PaymentMethod = require('../entity/PaymentMethod');
const PaymentType = require('../entity/PaymentType');
const User = require('../entity/User');
const sequelize = require('../db');

class DashboardService {
    async getOverviewStats(userId, query) {
        try {
            const { startDate, endDate } = query;

            // Date filters
            const dateFilter = {
                [Op.between]: [
                    startDate ? new Date(startDate) : new Date(new Date().setDate(1)), // First day of current month if no date provided
                    endDate ? new Date(endDate) : new Date()
                ]
            };

            // Get user type
            const user = await User.findByPk(userId);
            const whereClause = user.accountType === 'super admin' ? {} : {
                userId
            };

            // Get payment methods and types count
            const paymentMethodsCount = await PaymentMethod.count({
                where: {

                    status: 'active'
                }
            });

            const paymentTypesCount = await PaymentType.count({
                where: {
                    status: 'active'
                }
            });

            // Get transaction statistics
            const transactionStats = await Transaction.findAll({
                where: {
                    ...whereClause,
                    createdAt: dateFilter
                },
                attributes: [
                    [Sequelize.fn('COUNT', Sequelize.col('id')), 'totalTransactions'],
                    [Sequelize.fn('SUM', Sequelize.col('amount')), 'totalAmount'],
                    [Sequelize.fn('SUM', Sequelize.col('commission')), 'totalCommission'],
                    [Sequelize.fn('SUM', Sequelize.col('agentCommission')), 'totalAgentCommission'],
                    [Sequelize.fn('SUM', Sequelize.col('settledCommission')), 'settledAmount']

                ],
                raw: true
            });

            const stats = transactionStats[0];

            return {
                status: true,
                message: "Overview statistics retrieved successfully",
                data: {
                    paymentMethods: paymentMethodsCount,
                    paymentTypes: paymentTypesCount,
                    transactions: {
                        count: Number(stats.totalTransactions) || 0,
                        totalAmount: Number(stats.totalAmount) || 0,
                        totalCommission: Number(stats.totalCommission) || 0,
                        agentCommission: Number(stats.totalAgentCommission) || 0,
                        settledAmount: Number(stats.settledAmount) || 0
                    }
                }
            };

        } catch (error) {
            return {
                status: false,
                message: error.message || "Error retrieving overview statistics",
                error: error
            };
        }
    }
}

module.exports = new DashboardService(); 