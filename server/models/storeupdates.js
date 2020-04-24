"use strict";
module.exports = (sequelize, DataTypes) => {
  const StoreUpdates = sequelize.define(
    "StoreUpdates",
    {
      storeId: DataTypes.INTEGER,
      ip: DataTypes.STRING,
      userId: DataTypes.STRING,
      availabilityInfo: DataTypes.STRING,
      safetyInfo: DataTypes.STRING,
      openingTime: DataTypes.STRING,
      closingTime: DataTypes.STRING,
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
      flag: DataTypes.STRING,
      deleted: DataTypes.BOOLEAN,
      reviewed: DataTypes.BOOLEAN,
      availabilityTags: DataTypes.ARRAY(DataTypes.STRING),
      safetyChecks: DataTypes.ARRAY(DataTypes.STRING),
    },
    {}
  );
  StoreUpdates.associate = function (models) {
    StoreUpdates.belongsTo(models.StoreInfo, {
      foreignKey: "storeId",
    });
    // associations can be defined here
  };
  return StoreUpdates;
};
