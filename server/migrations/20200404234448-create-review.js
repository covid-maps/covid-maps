'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Reviews', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userip: {
        type: Sequelize.STRING
      },
      latitude: {
        type: Sequelize.FLOAT
      },
      longitude: {
        type: Sequelize.FLOAT
      },
      category: {
        type: Sequelize.STRING
      },
      name: {
        type: Sequelize.STRING
      },
      safetyobservations: {
        type: Sequelize.STRING
      },
      reviewtext: {
        type: Sequelize.STRING
      },
      placeid: {
        type: Sequelize.STRING
      },
      city: {
        type: Sequelize.STRING
      },
      locality: {
        type: Sequelize.STRING
      },
      address: {
        type: Sequelize.STRING
      },
      opentime: {
        type: Sequelize.TIME
      },
      closetime: {
        type: Sequelize.TIME
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Reviews');
  }
};