const PaymentMethod = require('../entity/PaymentMethod');
const PaymentType = require('../entity/PaymentType');
const PaymentDetail = require('../entity/PaymentDetail');
const PaymentAccount = require('../entity/PaymentAccount');
const Transaction = require('../entity/Transaction');
const PaymentAccountService = require('./PaymentAccountService');
const { v4: uuidv4 } = require('uuid');
const sequelize = require('../db');
const { Op } = require('sequelize');
const User = require('../entity/User');

class PaymentService {
    async createPaymentMethod(data, userId) {
        const t = await sequelize.transaction();
        try {


            const getPaymentMethod = await PaymentMethod.findOne({
                where: {
                    name: data.name,
                    userId
                }
            })

            if (getPaymentMethod) {
                return {
                    status: false,
                    message: `${data.name} is already exist`
                }
            }

            const paymentMethod = await PaymentMethod.create({
                userId,
                name: data.name,
                image: data?.image,
                status: data?.status
            }, { transaction: t });

            await t.commit();
            return {
                status: true,
                message: "Payment Method created successfully",
                data: paymentMethod
            };
        } catch (error) {
            await t.rollback();
            throw error;
        }
    }

    async updatePaymentMethod(data, id, userId) {
        const t = await sequelize.transaction();
        try {

            const isExist = await PaymentMethod.findByPk(id);

            if (!isExist) {
                return {
                    status: false,
                    message: "Payment method not found."
                }
            }

            if (isExist.name !== data.name) {
                const getPaymentMethod = await PaymentMethod.findOne({
                    where: {
                        name: data.name,
                        userId
                    }
                })

                if (getPaymentMethod) {
                    return {
                        status: false,
                        message: `${data.name} is already exist`
                    }
                }
            }

            await PaymentMethod.update({
                name: data.name,
                image: data?.image,
                status: data?.status
            }, {
                where: {
                    id: id,
                    userId: userId
                }
            }, { transaction: t });

            const updatedMethod = await PaymentMethod.findOne({
                where: { id, userId }
            });

            await t.commit();
            return {
                status: true,
                message: "Payment Method updated successfully",
                data: updatedMethod
            };
        } catch (error) {
            await t.rollback();
            throw error;
        }
    }

    async getAllPaymentMethods(status) {
        try {

            const result = await PaymentMethod.findAll({
                where: {
                    ...(status ? { status } : {})
                }
            });

            return {
                status: true,
                message: "Payment Methods retrieved successfully",
                data: result
            }
        } catch (error) {
            throw error;
        }
    }

    async getSinglePaymentMethods(userId, methodId) {
        try {
            const result = await PaymentMethod.findOne({
                where: {
                    userId: userId,
                    id: methodId
                }
            });

            if (!result) {
                return {
                    status: false,
                    message: "Method Not found",
                    data: null
                }
            }

            return {
                status: true,
                message: "Payment Methods retrieved successfully",
                data: result
            }
        } catch (error) {
            throw error;
        }
    }

    async getPaymentTypesByMethodId(methodId, userId) {
        try {
            const result = await PaymentType.findAll({
                where: {
                    paymentMethodId: methodId,
                    status: "active",
                    userId: userId
                },
                include: [{
                    model: PaymentDetail,
                    where: { isActive: true },
                    required: false
                }]
            });

            return {
                status: true,
                message: "Payment Types retrieved successfully",
                data: result
            }
        } catch (error) {
            throw error;
        }
    }

    async getPaymentTypes(userId, query) {
        try {
            const result = await PaymentType.findAll({
                where: {
                    ...(query?.status ? { status: query?.status } : {}),
                },
                include: [{
                    model: PaymentDetail,
                    where: { isActive: true },
                    required: false
                },
                {
                    model: PaymentMethod,
                    required: false
                }

                ]
            });

            return {
                status: true,
                message: "Payment Types retrieved successfully",
                data: result
            }
        } catch (error) {
            throw error;
        }
    }

    async createPaymentType(data, userId) {
        const t = await sequelize.transaction();
        try {
            const getPaymentType = await PaymentType.findOne({
                where: {
                    name: data.name,
                    userId,
                    paymentMethodId: data.paymentMethodId
                }
            });

            if (getPaymentType) {
                return {
                    status: false,
                    message: `${data.name} already exists for this payment method`
                }
            }

            const paymentType = await PaymentType.create({
                userId,
                paymentMethodId: data.paymentMethodId,
                name: data.name,
                status: data?.status,
                image: data?.image,
            }, { transaction: t });

            if (data.details && data.details.length > 0) {
                const detailsData = data.details.map(detail => ({
                    userId,
                    paymentTypeId: paymentType.id,
                    value: detail.value,
                    charge: Number(Number(detail.charge || 0).toFixed(2)),
                    description: detail?.description,
                    maxLimit: detail.maxLimit || 0
                }));
                await PaymentDetail.bulkCreate(detailsData, { transaction: t });
            }

            const createdType = await PaymentType.findByPk(paymentType.id);

            await t.commit();
            return {
                status: true,
                message: "Payment Type created successfully",
                data: createdType
            };
        } catch (error) {
            await t.rollback();
            throw error;
        }
    }

    async updatePaymentType(data, id, userId) {
        const t = await sequelize.transaction();
        try {
            const isExist = await PaymentType.findOne({
                where: { id, userId },

            });

            if (!isExist) {
                return {
                    status: false,
                    message: "Payment type not found."
                }
            }

            if (isExist.name !== data.name) {
                const getPaymentType = await PaymentType.findOne({
                    where: {
                        name: data.name,
                        userId,
                        paymentMethodId: data.paymentMethodId || isExist.paymentMethodId
                    }
                });

                if (getPaymentType) {
                    return {
                        status: false,
                        message: `${data.name} already exists for this payment method`
                    }
                }
            }

            await PaymentType.update({
                name: data.name,
                image: data?.image,
                status: data?.status
            }, {
                where: {
                    id: id,
                    userId: userId
                }
            }, { transaction: t });

            // Update or create new details if provided
            if (data.details && data.details.length > 0) {
                // Get existing details
                const existingDetails = await PaymentDetail.findAll({
                    where: { paymentTypeId: id, isActive: true }
                });

                // Create a map of existing details by ID
                const existingDetailsMap = new Map(
                    existingDetails.map(detail => [detail.id, detail])
                );

                // Collect IDs that are present in the update
                const updatedDetailIds = data.details
                    .filter(detail => detail.id)
                    .map(detail => detail.id);

                // Deactivate details that are not in the update
                await PaymentDetail.update(
                    { isActive: false },
                    {
                        where: {
                            paymentTypeId: id,
                            id: { [Op.notIn]: updatedDetailIds }
                        },
                        transaction: t
                    }
                );

                // Process each detail
                for (const detail of data.details) {
                    if (detail.id && existingDetailsMap.has(detail.id)) {
                        // Update existing detail
                        await PaymentDetail.update(
                            {
                                value: detail.value,
                                description: detail?.description,
                                charge: Number(Number(detail.charge || 0).toFixed(2)),
                                maxLimit: detail.maxLimit || 0,
                                isActive: true
                            },
                            {
                                where: { id: detail.id },
                                transaction: t
                            }
                        );
                    } else {
                        // Create new detail
                        await PaymentDetail.create(
                            {
                                userId,
                                paymentTypeId: id,
                                value: detail.value,
                                description: detail?.description,
                                charge: Number(Number(detail.charge || 0).toFixed(2)),
                                maxLimit: detail.maxLimit || 0,
                                isActive: true
                            },
                            { transaction: t }
                        );
                    }
                }
            } else {
                // If no details provided, deactivate all existing details
                await PaymentDetail.update(
                    { isActive: false },
                    {
                        where: { paymentTypeId: id },
                        transaction: t
                    }
                );
            }

            const updatedType = await PaymentType.findOne({
                where: { id, userId },
                include: [{
                    model: PaymentDetail,
                    where: { isActive: true },
                    required: false
                }]
            });

            await t.commit();
            return {
                status: true,
                message: "Payment Type updated successfully",
                data: updatedType
            };
        } catch (error) {
            await t.rollback();
            throw error;
        }
    }

    async getAllPaymentTypes(userId, status) {
        try {

            const result = await PaymentType.findAll({
                where: {
                    ...(status ? { status } : {}),
                    userId: userId
                },
                include: [{
                    model: PaymentDetail,
                    where: { status: 'active' },
                    required: false
                }]
            });

            return {
                status: true,
                message: "Payment Types retrieved successfully",
                data: result
            }
        } catch (error) {
            throw error;
        }
    }

    async getSinglePaymentType(userId, typeId) {
        try {
            const result = await PaymentType.findOne({
                where: {
                    id: typeId,
                    userId: userId
                },
                include: [{
                    model: PaymentDetail,
                    where: { status: 'active' },
                    required: false
                }]
            });

            if (!result) {
                return {
                    status: false,
                    message: "Payment Type not found",
                    data: null
                }
            }

            return {
                status: true,
                message: "Payment Type retrieved successfully",
                data: result
            }
        } catch (error) {
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
            // Find available payment detail
            const availableDetail = await this.findAvailablePaymentDetail(data.paymentTypeId, data.amount);

            // Find available account for the payment detail
            const availableAccount = await PaymentAccountService.findAvailableAccount(availableDetail.id, data.amount);

            const transaction = await Transaction.create({
                userId,
                paymentMethodId: data.paymentMethodId,
                paymentTypeId: data.paymentTypeId,
                paymentDetailId: availableDetail.id,
                paymentAccountId: availableAccount.id,
                type: data.type,
                amount: data.amount,
                transactionId: uuidv4()
            }, { transaction: t });

            // Update account usage
            await PaymentAccountService.updateAccountUsage(availableAccount.id, data.amount, t);

            const createdTransaction = await Transaction.findByPk(transaction.id, {
                include: [
                    { model: PaymentMethod },
                    { model: PaymentType },
                    { model: PaymentDetail },
                    { model: PaymentAccount }
                ]
            });

            await t.commit();
            return {
                status: true,
                message: "Transaction created successfully",
                data: createdTransaction
            };
        } catch (error) {
            await t.rollback();
            throw error;
        }
    }

    async getUserTransactions(userId) {
        try {
            const transactions = await Transaction.findAll({
                where: { userId },
                include: [
                    { model: PaymentMethod },
                    { model: PaymentType },
                    { model: PaymentDetail },
                    { model: PaymentAccount }
                ],
                order: [['createdAt', 'DESC']]
            });

            return {
                status: true,
                message: "Transactions retrieved successfully",
                data: transactions
            };
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

    async deletePaymentType(id) {
        const t = await sequelize.transaction();
        try {
            // Check if payment type exists and belongs to user
            const paymentType = await PaymentType.findOne({
                where: { id: id }
            });

            if (!paymentType) {
                return {
                    status: false,
                    message: "Payment type not found"
                };
            }


            // Deactivate all associated payment details
            await PaymentDetail.update(
                { isActive: false },
                {
                    where: { paymentTypeId: id },
                    transaction: t
                }
            );

            // Deactivate all associated payment accounts
            await PaymentAccount.update(
                { isActive: false },
                {
                    where: {
                        paymentDetailId: {
                            [Op.in]: sequelize.literal(`(SELECT id FROM PaymentDetails WHERE paymentTypeId = ${id})`)
                        }
                    },
                    transaction: t
                }
            );

            // Update payment type status to inactive
            await PaymentType.update(
                { status: 'inactive' },
                {
                    where: { id },
                    transaction: t
                }
            );

            await t.commit();
            return {
                status: true,
                message: "Payment type and associated details deleted successfully"
            };
        } catch (error) {
            await t.rollback();
            throw error;
        }
    }


    async getPaymentDetails(userId, paymentDetailId) {
        const t = await sequelize.transaction();
        try {

            const paymentDetailsData = await PaymentDetail.findByPk(paymentDetailId, {
                include: [{
                    model: PaymentType,
                    include: [{
                        model: PaymentMethod
                    }]
                }]
            })
            // Check if payment type exists and belongs to user
            const paymentType = await PaymentAccount.findAll({
                where: { paymentDetailId: paymentDetailId, userId: userId }
            });

            if (!paymentType) {
                return {
                    status: false,
                    message: "Payment type not found"
                };
            }

            await t.commit();
            return {
                status: true,
                message: "Payment account retrieved",
                data: {
                    paymentMethod: paymentDetailsData,
                    accountInfo: paymentType
                }
            };
        } catch (error) {
            await t.rollback();
            throw error;
        }
    }

    async getPaymentDetailsByTypeId(userId, paymentTypeId) {
        const t = await sequelize.transaction();
        try {

            const paymentDetailsData = await PaymentType.findOne({
                where: {
                    id: paymentTypeId,
                },
                include: [{
                    model: PaymentMethod
                }]
            })
            // Check if payment type exists and belongs to user
            const paymentType = await PaymentAccount.findAll({
                where: { paymentTypeId: paymentDetailsData.id, userId: userId }
            });

            if (!paymentType) {
                return {
                    status: false,
                    message: "Payment type not found"
                };
            }

            await t.commit();
            return {
                status: true,
                message: "Payment account retrieved",
                data: {
                    paymentMethod: { PaymentType: paymentDetailsData },
                    accountInfo: paymentType
                }
            };
        } catch (error) {
            await t.rollback();
            throw error;
        }
    }
}

module.exports = new PaymentService(); 