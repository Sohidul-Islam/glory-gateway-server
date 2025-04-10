const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User, UserSubscription, SubscriptionPlan, UserRole } = require('../entity');
const EmailService = require('./EmailService');
const { Op } = require('sequelize');
const sequelize = require('../db');

function generateUniqueId(length = 10) {
    const generatedIds = new Set();
    if (length < 3) throw new Error("Minimum length should be 3");

    while (true) {
        // Timestamp part (in base36 for compactness)
        const timestamp = Date.now().toString(36);
        // Random part to fill remaining length
        const randomPart = Array.from({ length: length - timestamp.length }, () =>
            Math.floor(Math.random() * 36).toString(36)
        ).join('');

        const newAgentId = (timestamp + randomPart).slice(0, length);

        // Ensure uniqueness
        if (!generatedIds.has(newAgentId)) {
            generatedIds.add(newAgentId);
            return newAgentId;
        }
    }
}

const AuthService = {
    async register(userData) {
        try {
            const hashedPassword = await bcrypt.hash(userData.password, 10);

            if (userData.accountType === "super admin") {
                const isExistSuperAdmin = await User.findOne({
                    where: {
                        accountType: "super admin"
                    }
                })

                if (isExistSuperAdmin) {
                    return { status: false, message: "Super admin already exist", data: null };
                }
            }

            const user = await User.create({
                ...userData,
                password: hashedPassword,
                accountStatus: 'inactive',
                isVerified: false,
                agentId: generateUniqueId(10)
            });

            await EmailService.sendVerificationEmail(user)

            // await EmailService.sendVerificationEmail(user);

            return {
                status: true,
                message: 'Registration successful. Please check your email to verify your account.',
                user: {
                    id: user.id,
                    email: user.email,
                    fullName: user.fullName
                }
            };
        } catch (error) {
            throw error;
        }
    },


    async makeAdmin(userData) {
        const t = await sequelize.transaction();
        try {
            const hashedPassword = await bcrypt.hash(userData.password, 10);

            // Check for super admin case
            if (userData.accountType !== "super admin") {
                return {
                    status: false,
                    message: "Account type must be super admin",
                    data: null
                }
            }

            // Check if admin exists
            const existingAdmin = await User.findOne({
                where: {
                    accountType: userData.accountType || "super admin"
                }
            });

            let user;
            if (existingAdmin) {
                // Update existing admin
                await existingAdmin.update({
                    fullName: userData.fullName,
                    email: userData.email,
                    password: hashedPassword,
                    phone: userData.phone,
                    address: userData?.address,
                    profileImage: userData?.profileImage,
                    accountStatus: userData.accountStatus || existingAdmin.accountStatus,
                    isVerified: true, // Since this is admin creation/update
                    updatedAt: new Date()
                }, { transaction: t });

                user = existingAdmin;

                await t.commit();
                return {
                    status: true,
                    message: 'Admin updated successfully',
                    data: {
                        id: user.id,
                        email: user.email,
                        fullName: user.fullName,
                        phone: user.phone,
                        accountType: user.accountType,
                        accountStatus: user.accountStatus,
                        address: user.address,
                        profileImage: user.profileImage,
                        updatedAt: user.updatedAt
                    }
                };
            } else {
                // Create new admin
                user = await User.create({
                    ...userData,
                    password: hashedPassword,
                    accountStatus: userData.accountStatus || 'active',
                    isVerified: true, // Since this is admin creation
                    accountType: userData.accountType || "super admin",
                    agentId: await generateUniqueId(10)
                }, { transaction: t });

                await t.commit();
                return {
                    status: true,
                    message: 'Admin created successfully',
                    data: {
                        id: user.id,
                        email: user.email,
                        fullName: user.fullName,
                        phone: user.phone,
                        accountType: user.accountType,
                        accountStatus: user.accountStatus,
                        address: user.address,
                        profileImage: user.profileImage,
                        createdAt: user.createdAt
                    }
                };
            }
        } catch (error) {
            await t.rollback();
            return {
                status: false,
                message: error.message || "Error creating/updating admin",
                error: error
            };
        }
    },

    async verifyEmail(token, email) {
        try {
            const user = await User.findOne({ where: { verificationToken: token, email } });

            if (!user) {
                throw new Error('Invalid verification token');
            }

            await user.update({
                isVerified: true,
                verificationToken: null
            });

            return {
                status: true,
                message: 'Email verified successfully'
            };
        } catch (error) {
            throw error;
        }
    },

    async login(email, password) {
        try {
            const user = await User.findOne({ where: { email } });

            const childUser = await UserRole.findOne({
                where: { email }, include: [

                    {
                        model: User,
                        as: "parent"
                    }
                ]
            })

            if (!user && !childUser) {
                throw new Error('User not found');
            }



            if (user && !user.isVerified) {
                await EmailService.sendVerificationEmail(user)
                return { status: false, message: "Please verify your email before logging in and we will send you a verification email again", data: null };
            }


            const isPasswordValid = await bcrypt.compare(password, user ? user.password : childUser.password);

            if (!isPasswordValid) {
                return { status: false, message: "Invalid Password", data: null };
            }

            const token = jwt.sign({ id: user ? user?.id : childUser?.parentUserId, childId: childUser?.id }, process.env.JWT_SECRET, { expiresIn: '15d' });
            return { status: true, message: "Login successful", data: { user: user ? user : { ...childUser.parent?.dataValues, child: childUser }, token } };
        } catch (error) {
            throw error;
        }
    },

    async getProfile(email) {
        try {
            const user = await User.findOne({ where: { email } });

            const childUser = await UserRole.findOne({
                where: { email }, include: [

                    {
                        model: User,
                        as: "parent"
                    }
                ]
            })


            if (!user && !childUser) {
                return { status: false, message: "User not found", data: null };
            }

            return { status: true, message: "Profile retrieved successfully", data: user ? user : { ...childUser.parent?.dataValues, child: childUser } };

        } catch (error) {
            return { status: false, message: "Failed to retrieve profile", data: null, error };
        }
    },

    async getUserById(userId) {
        try {
            const user = await User.findOne(
                {
                    where: {
                        id: userId
                    }
                }
            );

            if (!user) {
                return { status: false, message: "User not found", data: null };
            }

            return { status: true, message: "Profile retrieved successfully", data: user };

        } catch (error) {
            return { status: false, message: "Failed to retrieve profile", data: null, error };
        }
    },

    async updateProfile(userId, updateData) {
        try {
            const user = await User.findByPk(userId);
            if (!user) {
                return { status: false, message: "User not found", data: null, };
            }

            if (updateData.accountType === "super admin" && user.accountType !== "super admin") {
                const isExistSuperAdmin = await User.findOne({
                    where: {
                        accountType: "super admin"
                    }
                })

                if (isExistSuperAdmin) {
                    return { status: false, message: "Super admin already exist", data: null };
                }
            }

            await user.update(updateData);
            return { status: true, message: "Profile updated successfully", data: user };
        } catch (error) {
            return { status: false, message: "Failed to update profile", data: null, error };
        }
    },

    async authenticate(req, res, next) {
        try {
            const token = req.headers.authorization?.split(" ")[1] || req.query.token;

            if (!token) {
                return res.status(401).json({ status: false, message: "No token provided", data: null });
            }

            let decoded;
            try {
                decoded = jwt.verify(token, process.env.JWT_SECRET);
            } catch (error) {
                return res.status(401).json({ status: false, message: "Invalid or expired token", data: null });
            }

            const user = await User.findByPk(decoded.id);

            if (!user) {
                return res.status(404).json({ status: false, message: "User not found", data: null });
            }

            if (user.accountStatus === "inactive") {
                return res.status(401).json({ status: false, message: "User is not active. Please contact with support", data: null });
            }

            req.user = user;

            next();
        } catch (error) {
            return res.status(500).json({ status: false, message: "Authentication failed", data: null, error });
        }
    },

    async requestPasswordReset(email) {
        try {
            const user = await User.findOne({ where: { email } });

            if (!user) {
                throw new Error('User not found');
            }

            // Generate reset token
            const resetToken = jwt.sign(
                { userId: user.id },
                process.env.JWT_SECRET,
                { expiresIn: '1h' }
            );

            // Save reset token and expiry in database
            await user.update({
                resetToken: resetToken,
                resetTokenExpiry: new Date(Date.now() + 3600000) // 1 hour from now
            });

            // Send reset email
            await EmailService.sendResetPasswordEmail(email, resetToken);

            return {
                status: true,
                message: 'Password reset link sent to your email',
                data: null
            };
        } catch (error) {
            throw error;
        }
    },

    async verifyResetToken(token) {
        try {
            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            const user = await User.findOne({
                where: {
                    id: decoded.userId,
                    resetToken: token,
                    resetTokenExpiry: {
                        [Op.gt]: new Date()
                    }
                }
            });

            if (!user) {
                throw new Error('Invalid or expired reset token');
            }

            return {
                status: true,
                message: 'Token verified successfully',
                data: { userId: user.id }
            };
        } catch (error) {
            throw error;
        }
    },

    async resetPassword(token, newPassword) {
        try {
            // Verify token first
            const { data: { userId } } = await this.verifyResetToken(token);

            const user = await User.findByPk(userId);

            // Hash new password
            const hashedPassword = await bcrypt.hash(newPassword, 10);

            // Update password and clear reset token
            await user.update({
                password: hashedPassword,
                resetToken: null,
                resetTokenExpiry: null
            });

            return {
                status: true,
                message: 'Password reset successful',
                data: null
            };
        } catch (error) {
            throw error;
        }
    },

    async getAllUsers(query, UserId) {
        try {
            const page = parseInt(query.page) || 1;
            const pageSize = parseInt(query.pageSize) || 10;
            const offset = (page - 1) * pageSize;

            // Build where clause
            const whereClause = {};


            const getUserData = await User.findByPk(UserId);

            if (getUserData.accountType !== "super admin") {
                whereClause.id = UserId;
            }

            // Add search functionality
            if (query.searchKey) {
                whereClause[Op.or] = [
                    { email: { [Op.like]: `%${query.searchKey}%` } },
                    { phoneNumber: { [Op.like]: `%${query.searchKey}%` } }
                ];
            }

            // Add filters
            if (query.accountStatus) whereClause.accountStatus = query.accountStatus;
            if (query.accountType) whereClause.accountType = query.accountType;

            const { count, rows } = await User.findAndCountAll({
                where: whereClause,
                include: [
                    {
                        model: UserSubscription,
                        required: false, // LEFT JOIN to include users without subscriptions
                        where: {
                            status: 'active',
                            endDate: {
                                [Op.gt]: new Date()
                            },
                            paymentStatus: 'completed'
                        },

                        include: [
                            {
                                model: SubscriptionPlan
                            }
                        ]
                    }
                ],
                order: [['createdAt', 'DESC']],
                limit: pageSize,
                offset
            });

            const totalPages = Math.ceil(count / pageSize);

            return {
                status: true,
                message: "Users retrieved successfully",
                data: {
                    users: rows,
                    pagination: {
                        page,
                        pageSize,
                        totalPages,
                        totalItems: count,
                        hasNextPage: page < totalPages,
                        hasPreviousPage: page > 1
                    }
                }
            };

        } catch (error) {
            console.log({ error })
            throw error;
        }
    },

    isAdmin: async (req, res, next) => {
        try {
            // Check if user exists in request (should be added by authenticate middleware)
            if (!req?.user?.id) {
                return res.status(401).json({
                    status: false,
                    message: "Authentication required"
                });
            }


            if (req?.user.accountType !== "super admin") {
                return res.status(401).json({ status: false, message: "Admin access required", data: null });
            }

            // If user is admin, proceed to next middleware
            next();
        } catch (error) {
            return res.status(500).json({
                status: false,
                message: "Error checking admin status",
                error: error.message
            });
        }
    },
    // async generateAgentId
    async assignAgentId(userId, data) {

        try {
            // Check if user exists
            const user = await User.findByPk(userId);
            if (!user) {
                return {
                    status: false,
                    message: "User not found"
                };
            }

            let newAgentId;

            if (data?.agentId && user?.agentId !== data?.agentId) {
                // Check if the provided agentId is already in use
                const existingUser = await User.findOne({
                    where: { agentId: data.agentId }
                });

                if (existingUser) {
                    return {
                        status: false,
                        message: "This Agent ID is already in use"
                    };
                }

                // Validate the length of provided agentId (between 3 and 20 digits)
                if (data.agentId.length < 3 || data.agentId.length > 20) {
                    return {
                        status: false,
                        message: "Agent ID must be between 3 and 20 digits"
                    };
                }

                newAgentId = data.agentId;
            } else {
                // Generate new agent ID automatically
                let isUnique = false;
                while (!isUnique) {
                    const minDigits = 3;
                    const maxDigits = 20;
                    const digitLength = Math.floor(Math.random() * (maxDigits - minDigits + 1)) + minDigits;

                    newAgentId = generateUniqueId(digitLength)

                    const existingUser = await User.findOne({
                        where: { agentId: newAgentId }
                    });

                    if (!existingUser) {
                        isUnique = true;
                    }
                }
            }

            // Assign agent ID to user
            await User.update({
                agentId: newAgentId
            }, {
                where: { id: userId }
            });

            const updatedUser = await User.findByPk(userId);



            return {
                status: true,
                message: "Agent ID assigned successfully",
                data: updatedUser
            };
        } catch (error) {
            await t.rollback();
            throw error;
        }
    }
};

module.exports = AuthService;


