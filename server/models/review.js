'use strict';
module.exports = (sequelize, DataTypes) => {
  const Review = sequelize.define('Review', {
    userip: DataTypes.STRING,
    latitude: DataTypes.FLOAT,
    longitude: DataTypes.FLOAT,
    category: DataTypes.STRING,
    name: DataTypes.STRING,
    safetyobservations: DataTypes.STRING,
    reviewtext: DataTypes.STRING,
    placeid: DataTypes.STRING,
    city: DataTypes.STRING,
    locality: DataTypes.STRING,
    address: DataTypes.STRING,
    opentime: DataTypes.TIME,
    closetime: DataTypes.TIME
  }, {});
  Review.associate = function(models) {
    // associations can be defined here
  };
  return Review;
};