'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('StoreUpdates', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      storeId: {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: 'StoreInfos'
          },
          key: 'id'
        },
      },
      ip: {
        type: Sequelize.STRING
      },
      userId: {
        type: Sequelize.STRING
      },
      availabilityInfo: {
        type: Sequelize.STRING
      },
      safetyInfo: {
        type: Sequelize.STRING
      },
      openingTime: {
        type: Sequelize.STRING
      },
      closingTime: {
        type: Sequelize.STRING
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
    return queryInterface.dropTable('StoreUpdates');
  }
};