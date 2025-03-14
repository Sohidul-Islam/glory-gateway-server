const PaymentMethod = require('../entity/PaymentMethod');
const PaymentType = require('../entity/PaymentType');
const PaymentDetail = require('../entity/PaymentDetail');
const Transaction = require('../entity/Transaction');
const { v4: uuidv4 } = require('uuid');
const sequelize = require('../db');
const { Op } = require('sequelize');

class PaymentService {
    async createPaymentMethod(data) {
        const t = await sequelize.transaction();
        try {
            const paymentMethod = await PaymentMethod.create({
                name: data.name,
                image: data?.image
            }, { transaction: t });

            await t.commit();
            return paymentMethod;
        } catch (error) {
            await t.rollback();
            throw error;
        }
    }

    async updatePaymentMethod(data, id) {
        const t = await sequelize.transaction();
        try {
            await PaymentMethod.update({
                name: data.name,
                image: data?.image
            }, {
                where: { id: id }
            }, { transaction: t });

            const updatedMethod = await PaymentMethod.findByPk(id);
            await t.commit();
            return updatedMethod;
        } catch (error) {
            await t.rollback();
            throw error;
        }
    }

    async getAllPaymentMethods() {
        try {
            return await PaymentMethod.findAll({
                where: { isActive: true }
            });
        } catch (error) {
            throw error;
        }
    }

    async getPaymentTypesByMethodId(methodId) {
        try {
            return await PaymentType.findAll({
                where: {
                    paymentMethodId: methodId,
                    isActive: true
                },
                include: [{
                    model: PaymentDetail,
                    where: { isActive: true },
                    required: false
                }]
            });
        } catch (error) {
            throw error;
        }
    }

    async createPaymentType(data) {
        const t = await sequelize.transaction();
        try {
            const paymentType = await PaymentType.create({
                paymentMethodId: data.paymentMethodId,
                name: data.name
            }, { transaction: t });

            if (data.details && data.details.length > 0) {
                const detailsData = data.details.map(detail => ({
                    paymentTypeId: paymentType.id,
                    value: detail.value,
                    maxLimit: detail.maxLimit || 0
                }));
                await PaymentDetail.bulkCreate(detailsData, { transaction: t });
            }

            const createdType = await PaymentType.findByPk(paymentType.id, {
                include: [PaymentDetail]
            });

            await t.commit();
            return createdType;
        } catch (error) {
            await t.rollback();
            throw error;
        }
    }

    async findAvailablePaymentDetail(paymentTypeId, amount) {
        try {
            const availableDetail = await PaymentDetail.findOne({
                where: {
                    paymentTypeId,
                    isActive: true,
                    [Op.or]: [
                        { maxLimit: 0 },
                        sequelize.literal(`maxLimit = 0 OR (currentUsage + ${amount} <= maxLimit)`)
                    ]
                }
            });

            if (!availableDetail) {
                throw new Error('No available payment details found');
            }

            return availableDetail;
        } catch (error) {
            throw error;
        }
    }

    async createTransaction(userId, data) {
        const t = await sequelize.transaction();
        try {
            const availableDetail = await this.findAvailablePaymentDetail(data.paymentTypeId, data.amount);

            const transaction = await Transaction.create({
                userId,
                paymentMethodId: data.paymentMethodId,
                paymentTypeId: data.paymentTypeId,
                paymentDetailId: availableDetail.id,
                type: data.type,
                amount: data.amount,
                transactionId: uuidv4()
            }, { transaction: t });

            if (availableDetail.maxLimit > 0) {
                await availableDetail.increment('currentUsage', {
                    by: data.amount,
                    transaction: t
                });
            }

            const createdTransaction = await Transaction.findByPk(transaction.id, {
                include: [
                    { model: PaymentMethod },
                    { model: PaymentType },
                    { model: PaymentDetail }
                ]
            });

            await t.commit();
            return createdTransaction;
        } catch (error) {
            await t.rollback();
            throw error;
        }
    }

    async getUserTransactions(userId) {
        try {
            return await Transaction.findAll({
                where: { userId },
                include: [
                    { model: PaymentMethod },
                    { model: PaymentType },
                    { model: PaymentDetail }
                ],
                order: [['createdAt', 'DESC']]
            });
        } catch (error) {
            throw error;
        }
    }

    async updateTransactionStatus(transactionId, status) {
        const t = await sequelize.transaction();
        try {
            const transaction = await Transaction.findByPk(transactionId);
            if (!transaction) {
                throw new Error('Transaction not found');
            }

            await transaction.update({ status }, { transaction: t });

            const updatedTransaction = await Transaction.findByPk(transactionId, {
                include: [
                    { model: PaymentMethod },
                    { model: PaymentType },
                    { model: PaymentDetail }
                ]
            });

            await t.commit();
            return updatedTransaction;
        } catch (error) {
            await t.rollback();
            throw error;
        }
    }
}

module.exports = new PaymentService(); 