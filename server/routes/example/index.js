module.exports = async function (fastify, _opts) {
  fastify.get('/', async (_request, _reply) => 'this is an example');
};
