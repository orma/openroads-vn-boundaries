'use strict';
var assert = require('assert');

// set the db urls base on environment
var DEFAULT_ENVIRONMENT = 'development';
var environment = process.env.MACROCOSM_ENV || DEFAULT_ENVIRONMENT;
var connection = process.env.DATABASE_URL || require('./local').connection[environment];

assert.ok(connection, 'Connection is undefined; check DATABASE_URL or local.js');

// connect knex to the current env's db.
var knex = require('knex')({
  client: 'pg',
  connection: connection,
  debug: false,
  pool: {
    min: 2,
    max: 10
  }
});

module.exports = knex;
