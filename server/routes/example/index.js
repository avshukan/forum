async function example(fastify, _opts) {
  fastify.get('/', async (_request, _reply) => 'this is an example');
}

module.exports = example;
