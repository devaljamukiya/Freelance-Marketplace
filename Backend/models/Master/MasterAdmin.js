const { DataTypes } = require('sequelize')
const { sequelize } = require('../../config/db')

const MasterAdmin = sequelize.define('MasterAdmin', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
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
    password: {
        type:DataTypes.STRING,
        allowNull:false
    }

},{
    timestamps:true,

})


module.exports = MasterAdmin
