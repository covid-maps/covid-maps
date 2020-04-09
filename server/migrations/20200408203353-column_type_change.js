'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
      return Promise.all([
        queryInterface.changeColumn("StoreInfos", "address", {
          type: Sequelize.TEXT
        }),
        queryInterface.changeColumn("StoreUpdates", "availabilityInfo", {
          type: Sequelize.TEXT
        }),
        queryInterface.changeColumn("StoreUpdates", "safetyInfo", {
          type: Sequelize.TEXT
        })
      ]);
  },

  down: (queryInterface, Sequelize) => {
      return Promise.all([
        queryInterface.changeColumn("StoreInfos", "address", {
          type: Sequelize.STRING
        }),
        queryInterface.changeColumn("StoreUpdates", "availabilityInfo", {
          type: Sequelize.STRING
        }),
        queryInterface.changeColumn("StoreUpdates", "safetyInfo", {
          type: Sequelize.STRING
        })
  ]);
  }
};
