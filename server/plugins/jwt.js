const fp = require('fastify-plugin');
const jwt = require('@fastify/jwt');

const { JWT_KEY } = process.env;

module.exports = fp(async (fastify, _opts) => {
  fastify.register(jwt, {
    secret: JWT_KEY,
    cookie: {
      cookieName: 'token',
      signed: false,
    },
  });

  fastify.decorate('authenticate', async (request, reply) => {
    try {
      await request.jwtVerify();
      fastify.log.info({ message: 'success verification' });
    } catch (error) {
      reply.send(error);
    }
  });
});
