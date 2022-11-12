const fp = require('fastify-plugin');
const cookie = require('@fastify/cookie');

module.exports = fp(async (fastify, _opts) => {
  fastify.register(cookie);
});
