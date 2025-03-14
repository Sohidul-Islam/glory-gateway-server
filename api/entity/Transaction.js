const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const User = require('./User');
const PaymentMethod = require('./PaymentMethod');
const PaymentType = require('./PaymentType');
const PaymentDetail = require('./PaymentDetail');

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
    type: {
        type: DataTypes.ENUM('DEPOSIT', 'WITHDRAWAL'),
        allowNull: false
    },
    amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('PENDING', 'COMPLETED', 'FAILED'),
        defaultValue: 'PENDING'
    },
    transactionId: {
        type: DataTypes.STRING,
        unique: true
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

module.exports = Transaction; 