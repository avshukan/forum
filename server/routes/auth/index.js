const { signup, login } = require('../../controllers/authController');

async function auth(fastify, _opts) {
  fastify.post('/signup', signup);
  fastify.post('/login', login);
}

module.exports = auth;
