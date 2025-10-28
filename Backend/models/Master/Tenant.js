const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/db');
const Plane = require('./Plane');

const Tenant = sequelize.define('Tenant', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        validate: {
            isEmail: {
                msg: 'Please Enter Valid Email Address'
            }
        }
    },
    companyName: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
    },
    password: {
        type: DataTypes.STRING
    },
    planId: {
        type: DataTypes.INTEGER,
    },
    verificationCode: {
        type: DataTypes.STRING, // store OTP code
    },
    codeExpiresAt: {
        type: DataTypes.DATE, // expiration timestamp
    },
    isVerified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    status: {
        type: DataTypes.STRING,
        defaultValue: 'active'
    }
}, {
    timestamps: true
});


Tenant.belongsTo(Plane, {foreignKey: 'planId',as: 'plan',onDelete: 'SET NULL'});

Plane.hasMany(Tenant, {foreignKey: 'planId',as: 'tenants',onDelete: 'CASCADE',});


module.exports = Tenant;
