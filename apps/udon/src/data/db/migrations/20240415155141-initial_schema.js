'use strict';

var fs = require('fs');
var path = require('path');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    const initialSchema = fs
      .readFileSync(path.join(__dirname, '../bentodb_schema.sql'))
      .toString();

    await queryInterface.sequelize.query(initialSchema);
  },

  async down(queryInterface) {
    await Promise.all(
      ['analytics', 'audit', 'core', 'debug'].map((schema) =>
        queryInterface.sequelize.query(`--sql
          DROP SCHEMA IF EXISTS ${schema} CASCADE;
        `)
      )
    );
  },
};
