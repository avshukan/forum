'use strict';
const postController = require('../../controllers/postController');

module.exports = async function (fastify, opts) {
  fastify.get('/', postController.getPosts);
};
