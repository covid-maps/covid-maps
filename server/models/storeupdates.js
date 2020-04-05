'use strict';
module.exports = (sequelize, DataTypes) => {
  const StoreUpdates = sequelize.define('StoreUpdates', {
    store_id: DataTypes.INTEGER,
    ip: DataTypes.STRING,
    user_id: DataTypes.STRING,
    availability_info: DataTypes.STRING,
    safety_info: DataTypes.STRING,
    opening_time: DataTypes.STRING,
    closing_time: DataTypes.STRING,
    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE
  }, {});
  StoreUpdates.associate = function(models) {
    // associations can be defined here
  };
  return StoreUpdates;
};