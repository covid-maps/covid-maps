'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query(
        "CREATE INDEX coordinate_idx ON \"StoreInfos\" USING GIST (coordinate)"
    )
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query(
      "DROP INDEX coordinate_idx"
    )
  }
};
