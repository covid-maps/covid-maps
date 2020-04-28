"use strict";
module.exports = (sequelize, DataTypes) => {
  const StoreInfo = sequelize.define(
    "StoreInfo",
    {
      name: DataTypes.STRING,
      category: DataTypes.STRING,
      latitude: DataTypes.FLOAT,
      longitude: DataTypes.FLOAT,
      placeId: DataTypes.STRING,
      address: DataTypes.STRING,
      city: DataTypes.STRING,
      locality: DataTypes.STRING,
      country: DataTypes.STRING,
      coordinate: DataTypes.GEOMETRY("POINT"),
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
    },
    {}
  );
  StoreInfo.associate = function (models) {
    StoreInfo.hasMany(models.StoreUpdates, { foreignKey: "storeId" });
  };
  return StoreInfo;
};
