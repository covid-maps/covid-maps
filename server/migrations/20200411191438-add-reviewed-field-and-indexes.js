'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
        queryInterface.addColumn("StoreUpdates", "reviewed", {
          type: Sequelize.BOOLEAN,
          defaultValue: false,
          allowNull: false,
        }),
        queryInterface.addIndex(
          'StoreUpdates',
          ['deleted']
        )
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
        queryInterface.removeColumn("StoreUpdates", "reviewed", {
          type: Sequelize.BOOLEAN,
          defaultValue: false,
          allowNull: false,
        }),
        queryInterface.removeIndex(
          'StoreUpdates',
          ['deleted']
        )
    ]);
  }
};
