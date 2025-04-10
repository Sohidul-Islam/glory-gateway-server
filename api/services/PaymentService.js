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

    async getPaymentTypes(query) {

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

            console.log({ query, result })

            return {
                status: true,
                message: "Payment Types retrieved successfully",
                data: result
            }
        } catch (error) {
            console.log({ error })
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

    async getAllPaymentTypes(status) {
        try {
            const result = await PaymentType.findAll({
                where: {
                    ...(status ? { status } : {}),
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

    async createTransaction(agentId, data, requestedBy) {
        const t = await sequelize.transaction();
        try {

            const userData = await User.findOne({
                where: {
                    agentId: agentId
                }
            });

            if (!userData) {
                return {
                    status: false,
                    message: "Agent not found"
                }
            }

            if (!data?.paymentAccountId && data.type === 'deposit') {
                return {
                    status: false,
                    message: "Payment account not provided"
                }
            }


            const transaction = await Transaction.create({
                userId: userData.id,
                paymentMethodId: data.paymentMethodId,
                paymentTypeId: data.paymentTypeId,
                paymentDetailId: data.paymentDetailId,
                paymentAccountId: data.paymentAccountId,
                paymentSource: data.paymentSource,
                paymentSourceId: data.paymentSourceId,
                givenTransactionId: data?.transactionId,
                attachment: data?.attachment,
                type: data.type,
                amount: data.amount,
                commission: data.type === 'withdraw' ? 0 : userData.commissionType === 'percentage'
                    ? Number((data.amount * userData.commission) / 100)
                    : Number(userData.commission),

                transactionId: uuidv4(),
                withdrawDescription: data?.withdrawDescription,
                withdrawAccountNumber: data?.withdrawAccountNumber,
                requestedBy: requestedBy
            }, { transaction: t });


            if (data.type === 'deposit') {
                await PaymentAccountService.updateAccountUsage(data?.paymentAccountId, data.amount, t);
            }

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



    async getUserTransactions(userId, query) {
        try {
            const {
                page = 1,
                limit = 10,
                paymentMethodId,
                paymentTypeId,
                paymentDetailId,
                paymentAccountId,
                source,
                sourceId,
                transactionId,
                type,
                startDate,
                endDate,
                status,
                sortBy = 'createdAt',
                sortOrder = 'DESC'
            } = query;

            // Calculate offset
            const offset = (page - 1) * limit;

            // Build where clause
            const whereClause = {
                userId,
                ...(paymentMethodId && { paymentMethodId }),
                ...(paymentTypeId && { paymentTypeId }),
                ...(paymentDetailId && { paymentDetailId }),
                ...(paymentAccountId && { paymentAccountId }),
                ...(source && { paymentSource: source }),
                ...(sourceId && { paymentSourceId: sourceId }),
                ...(transactionId && {
                    transactionId: {
                        [Op.like]: `%${transactionId}%`
                    }
                }),
                ...(type && { type }),
                ...(status && { status }),
                ...(startDate && endDate && {
                    createdAt: {
                        [Op.between]: [
                            new Date(startDate),
                            new Date(endDate)
                        ]
                    }
                })
            };

            // Get total count for pagination
            const total = await Transaction.count({
                where: whereClause
            });

            // Calculate total pages
            const totalPages = Math.ceil(total / limit);

            // Build sort order
            const order = [[sortBy, sortOrder]];

            // Get transactions with pagination and filters
            const transactions = await Transaction.findAll({
                where: whereClause,
                include: [
                    {
                        model: PaymentMethod,
                        attributes: ['id', 'name', 'image']
                    },
                    {
                        model: PaymentType,
                        attributes: ['id', 'name', 'image']
                    },
                    {
                        model: PaymentDetail,
                        attributes: ['id', 'value', 'description', 'charge']
                    },
                    {
                        model: PaymentAccount,
                        attributes: [
                            'id',
                            'accountNumber',
                            'accountName',
                            'branchName',
                            'routingNumber'
                        ]
                    }
                ],
                order,
                limit: parseInt(limit),
                offset: parseInt(offset),

            });

            return {
                status: true,
                message: "Transactions retrieved successfully",
                data: {
                    transactions,
                    pagination: {
                        total,
                        totalPages,
                        currentPage: parseInt(page),
                        limit: parseInt(limit),
                        hasNextPage: page < totalPages,
                        hasPrevPage: page > 1
                    }
                }
            };
        } catch (error) {
            return {
                status: false,
                message: error.message || "Error retrieving transactions",
                error: error
            };
        }
    }

    async updateTransactionStatus(transactionId, data, userId) {
        const t = await sequelize.transaction();
        try {
            const transaction = await Transaction.findByPk(transactionId, {
                include: [
                    {
                        model: PaymentAccount,
                        attributes: ['id', 'currentUsage', 'maxLimit']
                    }
                ]
            });

            if (!transaction) {
                return {
                    status: false,
                    message: 'Transaction not found'
                };
            }

            // Check if transaction is already approved/rejected
            if (transaction.status !== 'PENDING') {
                return {
                    status: false,
                    message: `Transaction is already ${transaction.status.toLowerCase()}`
                };
            }

            // If rejecting, we need to reverse the account usage
            if (data.status === 'REJECTED') {
                // Decrease the current usage of the account
                await PaymentAccount.update(
                    {
                        currentUsage: sequelize.literal(`currentUsage - ${transaction.amount}`)
                    },
                    {
                        where: { id: transaction.paymentAccountId },
                        transaction: t
                    }
                );
            }

            // Update transaction status
            await transaction.update({
                status: data.status,
                remarks: data?.remarks,
                attachment: data?.attachment,
                transactionId: data?.transactionId,
                approvedBy: userId,
                approvedAt: new Date(),
            }, { transaction: t });

            // Get updated transaction with all relations
            const updatedTransaction = await Transaction.findByPk(transactionId, {
                include: [
                    {
                        model: PaymentMethod,
                        attributes: ['id', 'name', 'image']
                    },
                    {
                        model: PaymentType,
                        attributes: ['id', 'name', 'image']
                    },
                    {
                        model: PaymentDetail,
                        attributes: ['id', 'value', 'description', 'charge']
                    },
                    {
                        model: PaymentAccount,
                        attributes: [
                            'id',
                            'accountNumber',
                            'accountName',
                            'branchName',
                            'routingNumber',
                            'maxLimit',
                            'currentUsage'
                        ]
                    },
                    {
                        model: User,
                        as: 'approver',
                        attributes: ['id', 'fullName', 'email'],
                        foreignKey: 'approvedBy'
                    }
                ]
            });

            await t.commit();
            return {
                status: true,
                message: `Transaction ${data.status.toLowerCase()} successfully`,
                data: updatedTransaction
            };
        } catch (error) {
            await t.rollback();
            return {
                status: false,
                message: error.message || "Error updating transaction status",
                error: error
            };
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

    async getAgentPaymentDetails(query) {
        try {
            const { agentId, paymentTypeId, paymentDetailId, transactionType } = query;



            // Find the agent/user
            const user = await User.findOne({
                where: {
                    agentId,
                },
            });



            if (!user) {
                return {
                    status: false,
                    message: "Agent not found"
                };
            }

            // Build the query for PaymentAccount
            const accountQuery = {
                where: {
                    userId: user.id,
                    // status: 'active',
                    [Op.or]: [
                        { maxLimit: 0 },  // unlimited limit
                        sequelize.literal('PaymentAccount.maxLimit > PaymentAccount.currentUsage')  // still has available limit
                    ],
                    ...(!paymentDetailId && paymentTypeId ? { paymentTypeId: Number(paymentTypeId) } : {}),
                    ...(paymentDetailId ? { paymentDetailId: Number(paymentDetailId) } : {})
                },
                include: [
                    {
                        model: PaymentType,
                        where: { status: 'active' },
                        attributes: ['id', 'name', 'image'],
                        include: [{
                            model: PaymentMethod,
                            where: { status: 'active' },
                            attributes: ['id', 'name', 'image'],
                            required: false
                        }],
                        required: false
                    },
                    {
                        model: PaymentDetail,
                        where: { isActive: true },
                        attributes: ['id', 'value', 'description', 'charge', 'maxLimit', 'currentUsage'],
                        include: [{
                            model: PaymentType,
                            where: { status: 'active' },
                            attributes: ['id', 'name', 'image'],
                            include: [{
                                model: PaymentMethod,
                                where: { status: 'active' },
                                attributes: ['id', 'name', 'image'],
                                required: false
                            }],
                            required: false
                        }],
                        required: false
                    }
                ],
                attributes: [
                    'id',
                    'accountNumber',
                    'accountName',
                    'branchName',
                    'routingNumber',
                    'maxLimit',
                    'currentUsage'
                ],
                order: [['currentUsage', 'ASC']],  // Get account with least usage first
                // limit: 1 // Only get one available account
            };



            const paymentAccount = await PaymentAccount.findOne(accountQuery);

            const paymentType = transactionType === "withdraw" ? await PaymentType.findOne({
                where: {
                    id: paymentTypeId
                },
                include: [{
                    model: PaymentMethod,
                    where: { status: 'active' },
                    attributes: ['id', 'name', 'image'],
                    required: false
                }]
            }) : null;

            const paymentDetail = transactionType === "withdraw" ? await PaymentDetail.findOne({
                where: {
                    id: paymentDetailId
                }
            }) : null;


            if (!paymentAccount && transactionType === 'deposit') {
                return {
                    status: false,
                    message: "No available payment accounts found"
                };
            }

            // Format the response
            const formattedResponse = {
                agent: {
                    id: user.id,
                    fullName: user.fullName,
                    agentId: user.agentId,
                    image: user.image,
                    status: user.accountStatus,
                    phone: user.phone,
                    email: user.email
                },
                paymentMethod: {
                    id: paymentAccount?.PaymentType?.PaymentMethod?.id || paymentAccount?.PaymentDetail?.PaymentType?.PaymentMethod?.id || paymentType?.PaymentMethod?.id,
                    name: paymentAccount?.PaymentType?.PaymentMethod?.name || paymentAccount?.PaymentDetail?.PaymentType?.PaymentMethod?.name || paymentType?.PaymentMethod?.name,
                    image: paymentAccount?.PaymentType?.PaymentMethod?.image || paymentAccount?.PaymentDetail?.PaymentType?.PaymentMethod?.image || paymentType?.PaymentMethod?.image
                },
                paymentType: {
                    id: paymentAccount?.PaymentType?.id || paymentAccount?.PaymentDetail?.PaymentType?.id || paymentType?.id,
                    name: paymentAccount?.PaymentType?.name || paymentAccount?.PaymentDetail?.PaymentType?.name || paymentType?.name,
                    image: paymentAccount?.PaymentType?.image || paymentAccount?.PaymentDetail?.PaymentType?.image || paymentType?.image
                },
                paymentDetail: {
                    id: paymentAccount?.PaymentDetail?.id || paymentDetail?.id,
                    value: paymentAccount?.PaymentDetail?.value || paymentDetail?.value,
                    description: paymentAccount?.PaymentDetail?.description || paymentDetail?.description,
                    charge: paymentAccount?.PaymentDetail?.charge || paymentDetail?.charge,
                    maxLimit: paymentAccount?.PaymentDetail?.maxLimit || paymentDetail?.maxLimit,
                    currentUsage: paymentAccount?.PaymentDetail?.currentUsage || paymentDetail?.currentUsage,
                    availableLimit: paymentAccount?.PaymentDetail?.maxLimit === 0 ?
                        'Unlimited' :
                        (paymentAccount?.PaymentDetail?.maxLimit - paymentAccount?.PaymentDetail?.currentUsage) ||
                        (paymentDetail?.maxLimit - paymentDetail?.currentUsage)
                },
                account: {
                    id: paymentAccount?.id,
                    accountNumber: paymentAccount?.accountNumber,
                    accountName: paymentAccount?.accountName,
                    branchName: paymentAccount?.branchName,
                    routingNumber: paymentAccount?.routingNumber,
                    maxLimit: paymentAccount?.maxLimit,
                    currentUsage: paymentAccount?.currentUsage,
                    availableLimit: paymentAccount?.maxLimit === 0 ?
                        'Unlimited' :
                        (paymentAccount?.maxLimit - paymentAccount?.currentUsage)
                }
            };

            return {
                status: true,
                message: "Payment details retrieved successfully",
                data: formattedResponse
            };
        } catch (error) {
            return {
                status: false,
                message: error.message || "Error retrieving payment details",
                error: error
            };
        }
    }
}

module.exports = new PaymentService(); 