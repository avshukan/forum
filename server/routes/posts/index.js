const postsController = require('../../controllers/postsController');

async function posts(fastify, _opts) {
  fastify.get('/', postsController.getPosts);
  fastify.post('/', { onRequest: [fastify.authenticate] }, postsController.createPost);
  fastify.delete('/:postId', { onRequest: [fastify.authenticate] }, postsController.deletePost);
  fastify.post('/:postId/comments', { onRequest: [fastify.authenticate] }, postsController.createComment);
  fastify.delete('/:postId/comments/:commentId', { onRequest: [fastify.authenticate] }, postsController.deleteComment);
}

module.exports = posts;
