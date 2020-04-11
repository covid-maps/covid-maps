'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
        queryInterface.addColumn("StoreUpdates", "flag", {
          type: Sequelize.STRING,
          defaultValue: '',
          allowNull: false,
        }),
        queryInterface.addColumn("StoreUpdates", "deleted", {
          type: Sequelize.BOOLEAN,
          defaultValue: false,
          allowNull: false,
        })
      ]);
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
        queryInterface.removeColumn("StoreUpdates", "flag", {
          type: Sequelize.STRING,
          defaultValue: '',
          allowNull: false,
        }),
        queryInterface.removeColumn("StoreUpdates", "deleted", {
          type: Sequelize.BOOLEAN,
          defaultValue: false,
          allowNull: false,
        })
    ]);
  }
};
