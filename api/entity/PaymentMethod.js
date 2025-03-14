const { DataTypes } = require('sequelize');
const sequelize = require('../db');


const PaymentMethod = sequelize.define('PaymentMethod', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.ENUM('MOBILE_BANKING', 'VISA', 'MASTERCARD', 'CREDIT_CARD', 'USDT'),
        allowNull: false
    },
    image: {
        type: DataTypes.STRING,
        allowNull: false
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
    tableName: 'payment_methods',
    timestamps: true
});

module.exports = PaymentMethod; 