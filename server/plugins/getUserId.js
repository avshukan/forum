'use strict';

const fp = require('fastify-plugin');
const getUserIdByDb = require('../helpers/getUserIdByDb');

// the use of fastify-plugin is required to be able
// to export the decorators to the outer scope
module.exports = fp(async function (fastify, _opts) {
  const { db } = fastify;
  const getUserId = getUserIdByDb(db);
  fastify.decorate('getUserId', getUserId, ['db']);
});
