const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const PaymentMethod = require('./PaymentMethod');
const User = require('./User');

const PaymentType = sequelize.define('PaymentType', {
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
    name: {
        type: DataTypes.STRING,
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
    tableName: 'payment_types',
    timestamps: true
});

// Define the relationship
PaymentType.belongsTo(User, { foreignKey: 'userId' });
PaymentType.belongsTo(PaymentMethod, { foreignKey: 'paymentMethodId' });
User.hasMany(PaymentType, { foreignKey: 'userId' });
PaymentMethod.hasMany(PaymentType, { foreignKey: 'paymentMethodId' });

module.exports = PaymentType; 