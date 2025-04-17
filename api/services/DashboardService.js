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
            const whereClause = user.accountType === 'super admin' ? {} : user.accountType === 'default' ? {
                requestedBy: userId
            } : {
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
                    [Sequelize.fn('SUM', Sequelize.col('settledCommission')), 'settledAmount'],

                    [Sequelize.fn('COUNT', Sequelize.col('id')), 'totalTransactions'],
                    [Sequelize.fn('SUM', Sequelize.literal('CASE WHEN type = "deposit" THEN amount ELSE 0 END')), 'totalDeposit'],
                    [Sequelize.fn('SUM', Sequelize.literal('CASE WHEN type = "withdraw" THEN amount ELSE 0 END')), 'totalWithdraw'],
                    [Sequelize.fn('SUM', Sequelize.literal('CASE WHEN status = "APPROVED" THEN amount ELSE 0 END')), 'totalApproved'],
                    [Sequelize.fn('SUM', Sequelize.literal('CASE WHEN status = "REJECTED" THEN amount ELSE 0 END')), 'totalRejected'],
                    [Sequelize.fn('SUM', Sequelize.literal('CASE WHEN status = "SETTLED" THEN amount ELSE 0 END')), 'totalSettled'],
                    [Sequelize.fn('COUNT', Sequelize.literal('CASE WHEN status = "APPROVED" THEN 1 END')), 'approvedCount'],
                    [Sequelize.fn('COUNT', Sequelize.literal('CASE WHEN status = "REJECTED" THEN 1 END')), 'rejectedCount'],
                    [Sequelize.fn('COUNT', Sequelize.literal('CASE WHEN status = "SETTLED" THEN 1 END')), 'settledCount'],
                    [Sequelize.fn('COUNT', Sequelize.literal('CASE WHEN status = "PENDING" THEN 1 END')), 'pendingCount'],

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
                        settledAmount: Number(stats.settledAmount) || 0,
                        totalDeposit: Number(stats.totalDeposit) || 0,
                        totalWithdraw: Number(stats.totalWithdraw) || 0,
                        totalApproved: Number(stats.totalApproved) || 0,
                        totalRejected: Number(stats.totalRejected) || 0,
                        totalSettled: Number(stats.totalSettled) || 0,
                        approvedCount: Number(stats.approvedCount) || 0,
                        settledCount: Number(stats.settledCount) || 0,
                        rejectedCount: Number(stats.rejectedCount) || 0,
                        pendingCount: Number(stats.pendingCount) || 0,

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