const { githubAuth } = require('../../../controllers/authController');

async function auth(fastify, _opts) {
  fastify.post('/signtoken', githubAuth);
}

module.exports = auth;
