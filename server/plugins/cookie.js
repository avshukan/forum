const fp = require('fastify-plugin');
const cookie = require('@fastify/cookie');

module.exports = fp(async (fastify, _opts) => {
  fastify.register(cookie, {
    secret: 'my-secret',
    hook: 'onRequest', // set to false to disable cookie autoparsing or set autoparsing on any of the following hooks: 'onRequest', 'preParsing', 'preHandler', 'preValidation'. default: 'onRequest'
    parseOptions: {}, // options for parsing cookies
  });
});
