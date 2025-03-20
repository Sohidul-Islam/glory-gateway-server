const PaymentAccount = require('../entity/PaymentAccount');
const PaymentDetail = require('../entity/PaymentDetail');
const sequelize = require('../db');
const { Op } = require('sequelize');

class PaymentAccountService {
    async createPaymentAccount(data, userId) {
        const t = await sequelize.transaction();
        try {
            // Check if account number already exists
            const existingAccount = await PaymentAccount.findOne({
                where: {
                    accountNumber: data.accountNumber,
                    userId,
                    isActive: true
                }
            });

            if (existingAccount) {
                return {
                    status: false,
                    message: 'Account number already exists'
                };
            }

            const account = await PaymentAccount.create({
                userId,
                paymentDetailId: data.paymentDetailId,
                paymentTypeId: data.paymentTypeId,
                accountNumber: data.accountNumber,
                branchName: data?.branchName,
                routingNumber: data?.routingNumber,
                maxLimit: data.maxLimit || 0,
                status: data.status || 'active'
            }, { transaction: t });

            await t.commit();
            return {
                status: true,
                message: 'Payment account created successfully',
                data: account
            };
        } catch (error) {
            await t.rollback();
            throw error;
        }
    }

    async updatePaymentAccount(data, id, userId) {
        const t = await sequelize.transaction();
        try {
            const account = await PaymentAccount.findOne({
                where: { id, userId, isActive: true }
            });

            if (!account) {
                return {
                    status: false,
                    message: 'Payment account not found'
                };
            }

            if (data.accountNumber && data.accountNumber !== account.accountNumber) {
                const existingAccount = await PaymentAccount.findOne({
                    where: {
                        accountNumber: data.accountNumber,
                        userId,
                        isActive: true,
                        id: { [Op.ne]: id }
                    }
                });

                if (existingAccount) {
                    return {
                        status: false,
                        message: 'Account number already exists'
                    };
                }
            }

            await PaymentAccount.update({
                accountNumber: data.accountNumber,
                branchName: data?.branchName,
                routingNumber: data?.routingNumber,
                maxLimit: data.maxLimit,
                status: data.status
            }, {
                where: { id, userId },
                transaction: t
            });

            const updatedAccount = await PaymentAccount.findByPk(id);

            await t.commit();
            return {
                status: true,
                message: 'Payment account updated successfully',
                data: updatedAccount
            };
        } catch (error) {
            await t.rollback();
            throw error;
        }
    }

    async getPaymentAccounts(userId, query = {}) {
        try {
            const accounts = await PaymentAccount.findAll({
                where: {
                    userId,
                    isActive: true,
                    ...(query.status ? { status: query.status } : {}),
                    ...(query.paymentDetailId ? { paymentDetailId: query.paymentDetailId } : {})
                },
                include: [{
                    model: PaymentDetail,
                    attributes: ['value', 'description']
                }]
            });

            return {
                status: true,
                message: 'Payment accounts retrieved successfully',
                data: accounts
            };
        } catch (error) {
            throw error;
        }
    }

    async findAvailableAccount(paymentDetailId, amount) {
        try {
            const availableAccount = await PaymentAccount.findOne({
                where: {
                    paymentDetailId,
                    isActive: true,
                    status: 'active',
                    [Op.or]: [
                        { maxLimit: 0 },
                        sequelize.literal(`maxLimit = 0 OR (currentUsage + ${amount} <= maxLimit)`)
                    ]
                },
                order: [
                    ['currentUsage', 'ASC']
                ]
            });

            if (!availableAccount) {
                throw new Error('No available payment account found');
            }

            return availableAccount;
        } catch (error) {
            throw error;
        }
    }

    async updateAccountUsage(accountId, amount, t) {
        try {
            const account = await PaymentAccount.findByPk(accountId);
            if (!account) {
                throw new Error('Payment account not found');
            }

            if (account.maxLimit > 0 && (account.currentUsage + amount) > account.maxLimit) {
                throw new Error('Account limit exceeded');
            }

            await account.increment('currentUsage', {
                by: amount,
                transaction: t
            });

            return account;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new PaymentAccountService(); 