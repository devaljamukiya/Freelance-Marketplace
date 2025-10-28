const { DataTypes } = require('sequelize')
const { sequelize } = require('../../config/db')

const application = (sequelize) => {
    const Application = sequelize.define('Application', {
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
        proposal: {
            type: DataTypes.TEXT
        },
        status: {
            type: DataTypes.ENUM('pending', 'accepted', 'rejected'),
            defaultValue: 'pending'
        },
    })
    return Application
}

module.exports = application