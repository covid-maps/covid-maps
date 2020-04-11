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
        ),
        queryInterface.addIndex(
          'StoreUpdates',
          ['reviewed']
        ),
        queryInterface.addIndex(
          'StoreUpdates',
          ['flag']
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
        ),
        queryInterface.removeIndex(
          'StoreUpdates',
          ['reviewed']
        ),
        queryInterface.removeIndex(
          'StoreUpdates',
          ['flag']
        )
    ]);
  }
};
