const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const User = require('./User');
const PaymentMethod = require('./PaymentMethod');
const PaymentType = require('./PaymentType');
const PaymentDetail = require('./PaymentDetail');
const PaymentAccount = require('./PaymentAccount');

const Transaction = sequelize.define('Transaction', {
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
    paymentMethodId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: PaymentMethod,
            key: 'id'
        }
    },
    paymentTypeId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: PaymentType,
            key: 'id'
        }
    },
    paymentDetailId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: PaymentDetail,
            key: 'id'
        }
    },
    paymentAccountId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    transactionId: {
        type: DataTypes.STRING,
        allowNull: false
    },
    type: {
        type: DataTypes.ENUM('credit', 'debit'),
        allowNull: false
    },
    amount: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('pending', 'completed', 'failed'),
        defaultValue: 'pending'
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
    tableName: 'transactions',
    timestamps: true
});

// Define relationships
Transaction.belongsTo(User, { foreignKey: 'userId' });
Transaction.belongsTo(PaymentMethod, { foreignKey: 'paymentMethodId' });
Transaction.belongsTo(PaymentType, { foreignKey: 'paymentTypeId' });
Transaction.belongsTo(PaymentDetail, { foreignKey: 'paymentDetailId' });
Transaction.belongsTo(PaymentAccount, { foreignKey: 'paymentAccountId' });

module.exports = Transaction; 