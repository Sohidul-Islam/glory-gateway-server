const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const PaymentDetail = require('./PaymentDetail');
const User = require('./User');
const PaymentType = require('./PaymentType');

const PaymentAccount = sequelize.define('PaymentAccount', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id'
        }
    },
    paymentDetailId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: null,
        references: {
            model: PaymentDetail,
            key: 'id'
        }
    },
    paymentTypeId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: null,
        references: {
            model: PaymentType,
            key: 'id'
        }
    },
    accountNumber: {
        type: DataTypes.STRING,
        allowNull: false
    },
    accountName: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: ""
    },
    routingNumber: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: ""
    },
    branchName: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: ""
    },
    maxLimit: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0 // 0 means unlimited
    },
    currentUsage: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0
    },
    status: {
        type: DataTypes.ENUM('active', 'inactive'),
        defaultValue: 'active'
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    updatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'payment_accounts',
    timestamps: true
});

PaymentAccount.belongsTo(PaymentDetail, { foreignKey: 'paymentDetailId' });
PaymentAccount.belongsTo(PaymentType, { foreignKey: 'paymentTypeId' });
PaymentDetail.hasMany(PaymentAccount, { foreignKey: 'paymentDetailId' });
PaymentType.hasMany(PaymentAccount, { foreignKey: 'paymentTypeId' });

module.exports = PaymentAccount; 