const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const PaymentAccount = sequelize.define('PaymentAccount', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    paymentDetailId: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    paymentTypeId: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    accountNumber: {
        type: DataTypes.STRING,
        allowNull: false
    },
    branchName: {
        type: DataTypes.STRING,
        allowNull: true
    },
    routingNumber: {
        type: DataTypes.STRING,
        allowNull: true
    },
    maxLimit: {
        type: DataTypes.DECIMAL(15, 2),
        defaultValue: 0
    },
    currentUsage: {
        type: DataTypes.DECIMAL(15, 2),
        defaultValue: 0
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    status: {
        type: DataTypes.ENUM('active', 'inactive', 'blocked'),
        defaultValue: 'active'
    }
}, {
    timestamps: true
});

module.exports = PaymentAccount; 