async function root(fastify, _opts) {
  fastify.get('/', async (_request, _reply) => ({ root: true }));
}

module.exports = root;
