const { FRONTEND_ORIGIN } = process.env;

async function auth(fastify, _opts) {
  fastify.post('/callback', async (request, reply) => {
    const { cookies, body } = request;
    fastify.log.info({ message: `callback cookies: ${JSON.stringify(cookies)}` });
    fastify.log.info({ message: `callback body: ${JSON.stringify(body)}` });

    reply
      .header('Access-Control-Allow-Origin', FRONTEND_ORIGIN);

    reply
      .send({ message: 'Hello, Callback!' });
  });

  fastify.post('/signtoken',);
}

module.exports = auth;
