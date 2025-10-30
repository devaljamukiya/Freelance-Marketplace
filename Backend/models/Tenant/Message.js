//client <-> freelancer in message

const { DataTypes } = require('sequelize')
const { sequelize } = require('../../config/db')

const message = (sequelize) => {
    const Message = sequelize.define('Message', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        senderId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        receiverId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        projectId: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        // contractId: {
        //     type: DataTypes.INTEGER,
        //     allowNull: true,
        // },
        message: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
    })
    return Message
}

module.exports = message