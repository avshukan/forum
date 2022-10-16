'use strict';

const fp = require('fastify-plugin');
const dbConfig = require('../dbConfig');

// the use of fastify-plugin is required to be able
// to export the decorators to the outer scope
module.exports = fp(async function (fastify, opts) {
  const db = opts.db ?? dbConfig;
  fastify.decorate('db', db);
});
