const { DataTypes } = require('sequelize')
const { sequelize } = require('../../config/db')


const payment = (sequelize) => {
    const Payment = sequelize.define('Payment', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        contractId: {
            type: DataTypes.INTEGER
        },
        amount: {
            type: DataTypes.FLOAT
        },
        method: {
            type: DataTypes.ENUM('paypal')
        },
        status: {
            type: DataTypes.ENUM('pending', 'completed', 'failed'),
            defaultValue: 'pending'
        },
    })
    return Payment
}

module.exports = payment