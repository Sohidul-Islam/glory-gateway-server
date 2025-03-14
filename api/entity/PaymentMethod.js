const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const User = require('./User');

const PaymentMethod = sequelize.define('PaymentMethod', {
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
    name: {
        type: DataTypes.ENUM('MOBILE_BANKING', 'VISA', 'MASTERCARD', 'CREDIT_CARD', 'USDT'),
        allowNull: false
    },
    image: {
        type: DataTypes.STRING,
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM("active", "inactive"),
        defaultValue: "active"
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

PaymentMethod.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(PaymentMethod, { foreignKey: 'userId' });

module.exports = PaymentMethod; 