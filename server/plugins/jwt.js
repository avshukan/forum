const fp = require('fastify-plugin');
const jwt = require('@fastify/jwt');

const { JWT_KEY } = process.env;

module.exports = fp(async (fastify, _opts) => {
  fastify.register(jwt, {
    secret: JWT_KEY,
    cookie: {
      cookieName: 'token',
      signed: false
    },
  });

  fastify.decorate('authenticate', async (request, reply) => {
    try {
      console.log('Object.keys(request)', Object.keys(request));
      console.log('request.query', request.query);
      console.log('request.cookies', request.cookies);
      console.log('request.user', request.user);
      const decode = await request.jwtVerify();
      fastify.log.info({ decode });
    } catch (error) {
      reply.send(error);
    }
  });
});
