const { DataTypes } = require('sequelize');

const rolePermission = (sequelize) => {
  const RolePermission = sequelize.define('RolePermission', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    roleId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    featureId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    canView: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    canInsert: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    canUpdate: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    canDelete: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  });

  return RolePermission;
};

module.exports = rolePermission;
