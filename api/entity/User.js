const Sequelize = require("sequelize");
const sequelize = require("../db");

const User = sequelize.define(
    "User", // Model name is singular to follow Sequelize conventions
    {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        fullName: {
            type: Sequelize.STRING,
            allowNull: false,
            comment: "Name of the user or shop owner",
        },
        email: {
            type: Sequelize.STRING(100),
            allowNull: false,
            unique: "email",
            validate: {
                isEmail: true,
            },
        },
        image: {
            type: Sequelize.STRING,
            allowNull: true,
        },
        phoneNumber: {
            type: Sequelize.STRING(50),
            allowNull: false,
            unique: "phoneNumber",
            comment: "Phone number of the user",
        },
        location: {
            type: Sequelize.STRING,
            allowNull: true,
            comment: "User's location",
        },
        businessName: {
            type: Sequelize.STRING,
            allowNull: true,
            comment: "Name of the user's business",
        },
        businessType: {
            type: Sequelize.STRING,
            allowNull: true,
            comment: "Type of business the user runs",
        },
        password: {
            type: Sequelize.STRING,
            allowNull: false,
            comment: "Hashed password of the user",
        },
        accountStatus: {
            type: Sequelize.ENUM("active", "inactive"),
            allowNull: false,
            defaultValue: "active",
            comment: "Status of the user account",
        },
        accountType: {
            type: Sequelize.ENUM("super admin", "agent", "default"),
            defaultValue: "agent"
        },
        isVerified: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false,
            comment: "Indicates if the user is email verified",
        },
        verificationToken: {
            type: Sequelize.STRING,
            allowNull: true,
            comment: "Token for email verification",
        },
        agentId: {
            type: Sequelize.STRING,
            unique: "ageintId",
            allowNull: true,
            comment: "custom agent id",
        },
        reference: {
            type: Sequelize.STRING,
            allowNull: true,
            comment: "Reference code for the user",
        },
        resetTokenExpiry: {
            type: Sequelize.DATE,
            defaultValue: null
        },
        resetToken: {
            type: Sequelize.STRING,
            defaultValue: null
        },
        commission: {
            type: Sequelize.DECIMAL(15, 2),
            allowNull: true,
            defaultValue: 0
        },
        commissionType: {
            type: Sequelize.ENUM('percentage', 'fixed'),
            allowNull: true,
            defaultValue: 'percentage'
        },
        agentCommission: {
            type: Sequelize.DECIMAL(15, 2),
            allowNull: true,
            defaultValue: 0
        },
        agentCommissionType: {
            type: Sequelize.ENUM('percentage', 'fixed'),
            allowNull: true,
            defaultValue: 'percentage'
        },
        isLoggedIn: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false,
            comment: "Tracks if the user is currently logged in",
        },

    }
);

module.exports = User;
