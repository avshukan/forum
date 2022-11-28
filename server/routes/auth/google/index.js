async function auth(fastify, _opts) {
  fastify.get('/callback', async (request, reply) => {
    reply.send('Hello, Callback!')
  });
}

module.exports = auth;
