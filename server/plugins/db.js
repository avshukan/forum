'use strict'

const fp = require('fastify-plugin');
const db = require('../dbConfig');

// the use of fastify-plugin is required to be able
// to export the decorators to the outer scope
module.exports = fp(async function (fastify, opts) {
  const { mode } = opts;
  if (mode === 'test') {
    await db.migrate.latest()
      .then(function () {
        console.log('migrated')
        return db.seed.run();
      })
      .then(function () {
        console.log('seeded')
        // migrations are finished
      })
      .catch((error) => console.log('db_error', error));
  }
  fastify.decorate('db', db);
});
