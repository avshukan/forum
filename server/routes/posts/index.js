const postsController = require('../../controllers/postsController');

async function posts(fastify, _opts) {
  fastify.get('/', postsController.getPosts);
  fastify.post('/', postsController.createPost);
  fastify.delete('/:postId', postsController.deletePost);
  fastify.post('/:postId/comments', postsController.createComment);
  fastify.delete('/:postId/comments/:commentId', postsController.deleteComment);
}

module.exports = posts;
