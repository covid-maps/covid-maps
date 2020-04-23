'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
      return queryInterface.addColumn("StoreUpdates", "safetyChecks", {
        type: Sequelize.ARRAY(Sequelize.STRING),
        allowNull: true,
      });
  },

  down: (queryInterface, Sequelize) => {
      return queryInterface.removeColumn("StoreUpdates", "safetyChecks");
  }
};
