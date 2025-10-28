const { DataTypes } = require('sequelize')
const { sequelize } = require('../../config/db')

const client = (sequelize) => {
    const Client = sequelize.define('Client', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        userId:{
            type:DataTypes.INTEGER
        },
        company: {
            type:DataTypes.STRING
        },
        description:{
            type:DataTypes.TEXT
        },

    })
    return Client
}

module.exports = client