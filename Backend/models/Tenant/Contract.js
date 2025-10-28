const { DataTypes } = require('sequelize')
const { sequelize } = require('../../config/db')

const contract = (sequelize) => {
    const Contract = sequelize.define('Contract', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        projectId: {
            type: DataTypes.INTEGER
        },
        freelancerId: {
            type: DataTypes.INTEGER
        },
        clientId: {
            type: DataTypes.INTEGER
        },
        type: {
            type: DataTypes.ENUM('fixed', 'hourly', 'milestone')
        },
        status: {
            type: DataTypes.ENUM('active', 'completed', 'cancelled'),
            defaultValue: 'active'
        },
    })
    return Contract
}

module.exports = contract