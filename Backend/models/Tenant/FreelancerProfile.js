const { DataTypes } = require('sequelize')
const { sequelize } = require('../../config/db')

const freelancer = (sequelize) =>{
    const Freelancer = sequelize.define('Freelancer',{
        id:{
            type:DataTypes.INTEGER,
            autoIncrement:true,
            primaryKey:true
        },
        userId:{
            type:DataTypes.INTEGER
        },
        skills:{
            type:DataTypes.STRING
        },
        experience:{
            type:DataTypes.INTEGER
        },
        hourlyRate:{
            type:DataTypes.FLOAT
        },
        portfolioLink:{
            type:DataTypes.STRING
        }
    })
    return Freelancer
}

module.exports = freelancer