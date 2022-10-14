'use strict'

const fp = require('fastify-plugin');

// the use of fastify-plugin is required to be able
// to export the decorators to the outer scope
module.exports = fp(async function (fastify, _opts) {
  const getUserId = async (username) => {
    const user = await fastify.db('users')
      .where('username', username)
      .first();
    if (!!user) {
      return user.id;
    }
    const newUser = await fastify.db('users')
      .returning('id')
      .insert({ username });
    return newUser[0].id;
  }

  fastify.decorate('getUserId', getUserId, ['db']);
});
