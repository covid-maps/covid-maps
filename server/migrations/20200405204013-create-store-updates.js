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
      store_id: {
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
      user_id: {
        type: Sequelize.STRING
      },
      availability_info: {
        type: Sequelize.STRING
      },
      safety_info: {
        type: Sequelize.STRING
      },
      opening_time: {
        type: Sequelize.STRING
      },
      closing_time: {
        type: Sequelize.STRING
      },
      created_at: {
        type: Sequelize.DATE
      },
      updated_at: {
        type: Sequelize.DATE
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