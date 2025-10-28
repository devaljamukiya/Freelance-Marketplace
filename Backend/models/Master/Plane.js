const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/db');

const Plane = sequelize.define('Plane', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true, 
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    price: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    durationInDay: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    features: {
        type: DataTypes.JSON,
        allowNull: false
    },
    userLimit: {   
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1
    }
}, {
    timestamps: true
});

module.exports = Plane;
