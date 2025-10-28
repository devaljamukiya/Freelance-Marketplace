const { DataTypes } = require('sequelize')
const { sequelize } = require('../../config/db')

const setting = (sequelize) => {
    const Setting = sequelize.define('Setting',{
        id:{
            type:DataTypes.INTEGER,
            autoIncrement:true,
            primaryKey:true
        },
        userId: { 
            type: DataTypes.INTEGER 
        }

    })
    return Setting
}

module.exports = setting