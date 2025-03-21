
const PaymentMethod = require('../entity/PaymentMethod');
const PaymentType = require('../entity/PaymentType');
const PaymentDetail = require('../entity/PaymentDetail');
const { Op } = require('sequelize');
const { User, Banner } = require('../entity');

class UserService {
    async getAgentInfo(agentId) {
        console.log({ agentId })
        try {
            const agent = await User.findOne({
                where: {
                    agentId: agentId,
                    // accountStatus: 'active'
                },

                include: [
                    {
                        model: Banner,
                        where: {
                            status: 'active',
                        },
                        required: false,
                    }
                ]
            });

            if (!agent) {
                return {
                    status: false,
                    message: "Agent not found"
                };
            }

            // Format the response data


            return {
                status: true,
                message: "Agent information retrieved successfully",
                data: agent
            };
        } catch (error) {
            return {
                status: false,
                message: error.message || "Error retrieving agent information",
                error: error
            };
        }
    }

    async assignAgentId(userId, data) {
        const t = await sequelize.transaction();
        try {
            const user = await User.findByPk(userId);
            if (!user) {
                return {
                    status: false,
                    message: "User not found"
                };
            }

            if (user.agentId) {
                return {
                    status: false,
                    message: "User already has an agent ID"
                };
            }

            let newAgentId;

            if (data?.agentId) {
                const existingUser = await User.findOne({
                    where: { agentId: data.agentId }
                });

                if (existingUser) {
                    return {
                        status: false,
                        message: "This Agent ID is already in use"
                    };
                }

                if (data.agentId.length < 3 || data.agentId.length > 20) {
                    return {
                        status: false,
                        message: "Agent ID must be between 3 and 20 digits"
                    };
                }

                if (!/^\d+$/.test(data.agentId)) {
                    return {
                        status: false,
                        message: "Agent ID must contain only numbers"
                    };
                }

                newAgentId = data.agentId;
            } else {
                let isUnique = false;
                while (!isUnique) {
                    const minDigits = 3;
                    const maxDigits = 20;
                    const digitLength = Math.floor(Math.random() * (maxDigits - minDigits + 1)) + minDigits;

                    newAgentId = Math.floor(Math.pow(10, digitLength - 1) + Math.random() *
                        (Math.pow(10, digitLength) - Math.pow(10, digitLength - 1) - 1)).toString();

                    const existingUser = await User.findOne({
                        where: { agentId: newAgentId }
                    });

                    if (!existingUser) {
                        isUnique = true;
                    }
                }
            }

            await user.update({
                agentId: newAgentId,
                updatedAt: new Date()
            }, { transaction: t });

            await t.commit();

            return {
                status: true,
                message: "Agent ID assigned successfully",
                data: {
                    id: user.id,
                    fullName: user.fullName,
                    agentId: newAgentId
                }
            };
        } catch (error) {
            await t.rollback();
            return {
                status: false,
                message: error.message || "Error assigning agent ID",
                error: error
            };
        }
    }
}

module.exports = new UserService(); 