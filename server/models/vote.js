"use strict";
module.exports = (sequelize, DataTypes) => {
  const Vote = sequelize.define(
    "Votes",
    {
      type: DataTypes.STRING,
      ip: DataTypes.STRING,
      updateId: DataTypes.INTEGER,
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
    },
    {}
  );
  Vote.associate = function (models) {
    Vote.belongsTo(models.StoreUpdates, {
      foreignKey: "updateId",
    });
  };
  return Vote;
};
