const { DataTypes } = require('sequelize')
const { sequelize } = require('../../config/db')

const role = (sequelize)=>{
    const Role = sequelize.define('Role',{
        id:{
            type:DataTypes.INTEGER,
            autoIncrement:true,
            primaryKey:true
        },
        name:{
            type:DataTypes.STRING,
            allowNull:false
        }
    })
    return Role
}

module.exports = role