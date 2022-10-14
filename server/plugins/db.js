'use strict'

const fp = require('fastify-plugin');
const db = require('../dbConfig');

// the use of fastify-plugin is required to be able
// to export the decorators to the outer scope
module.exports = fp(async function (fastify, _opts) {
  fastify.decorate('db', db);
});
