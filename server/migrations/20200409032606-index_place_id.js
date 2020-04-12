'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addIndex(
        'StoreInfos',
        ['placeId'])
    },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeIndex(
        'StoreInfos',
        ['placeId'])
    }
};
