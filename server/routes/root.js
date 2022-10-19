module.exports = async function (fastify, _opts) {
  fastify.get('/', async (_request, _reply) => ({ root: true }));
};
