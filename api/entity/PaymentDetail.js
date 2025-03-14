const { DataTypes } = require('sequelize');

const PaymentType = require('./PaymentType');
const sequelize = require('../db');

const PaymentDetail = sequelize.define('PaymentDetail', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    paymentTypeId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: PaymentType,
            key: 'id'
        }
    },
    value: {
        type: DataTypes.STRING,
        allowNull: false
    },
    maxLimit: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0 // 0 means unlimited
    },
    currentUsage: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
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
    tableName: 'payment_details',
    timestamps: true
});

PaymentDetail.belongsTo(PaymentType, { foreignKey: 'paymentTypeId' });
PaymentType.hasMany(PaymentDetail, { foreignKey: 'paymentTypeId' });

module.exports = PaymentDetail; 