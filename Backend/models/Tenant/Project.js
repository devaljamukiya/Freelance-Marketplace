const { DataTypes } = require('sequelize')
const { sequelize } = require('../../config/db')

const project = (sequelize) => {
    const Project = sequelize.define('Project', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        title: {
            type: DataTypes.STRING
        },
        description: {
            type: DataTypes.TEXT
        },
        type: {
            type: DataTypes.ENUM('fixed', 'hourly')
        },
        budget: {
            type: DataTypes.FLOAT
        },
        clientId:{
            type:DataTypes.INTEGER
        },
        status: {
            type: DataTypes.ENUM('open', 'in-progress', 'completed', 'cancelled'),
            defaultValue: 'open'
        },
    })
    return Project
}

module.exports = project