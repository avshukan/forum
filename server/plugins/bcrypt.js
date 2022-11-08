const fp = require('fastify-plugin');
const bcrypt = require('fastify-bcrypt');

module.exports = fp(async (fastify, _opts) => {
  // https://www.npmjs.com/package/fastify-bcrypt
  fastify.register(bcrypt);
});
