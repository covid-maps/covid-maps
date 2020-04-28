"use strict";
module.exports = (sequelize, DataTypes) => {
  const Votes = sequelize.define(
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
  Votes.associate = function (models) {
    Votes.belongsTo(models.StoreUpdates, {
      foreignKey: "updateId",
    });
  };
  return Votes;
};
