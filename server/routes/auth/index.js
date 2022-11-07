const authController = require('../../controllers/authController');

async function auth(fastify, _opts) {
  fastify.post('/signup', authController.signup);
}

module.exports = auth;
