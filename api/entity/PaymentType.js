const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const PaymentMethod = require('./PaymentMethod');

const PaymentType = sequelize.define('PaymentType', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    paymentMethodId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: PaymentMethod,
            key: 'id'
        }
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    details: {
        type: DataTypes.JSON,
        allowNull: true
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
    tableName: 'payment_types',
    timestamps: true
});

// Define the relationship
PaymentType.belongsTo(PaymentMethod, { foreignKey: 'paymentMethodId' });
PaymentMethod.hasMany(PaymentType, { foreignKey: 'paymentMethodId' });

module.exports = PaymentType; 