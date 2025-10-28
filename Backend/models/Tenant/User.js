const { DataTypes } = require('sequelize')
const { sequelize } = require('../../config/db')

const user = (sequelize) => {
    const User = sequelize.define('User', {
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
        roleId: {
            type: DataTypes.INTEGER,
            allowNull:false
        },
        password:{
            type:DataTypes.STRING,
            allowNull:false
        }
        // emailVerified: { type: DataTypes.BOOLEAN, defaultValue: false },
    })
    return User
}

module.exports = user