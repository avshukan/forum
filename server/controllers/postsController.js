const yup = require('yup');
const getUsernameById = require('../helpers/getUsernameById');

async function getPosts(request, reply) {
  const { username } = request.query;

  try {
    yup
      .object({
        username: yup.string()
          .required('username is required')
          .max(20, 'username max length is 20'),
      })
      .validateSync({ username });
  } catch ({ message }) {
    reply
      .code(400)
      .send({
        error: 'Invalid query',
        detail: { message },
      });

    return;
  }

  try {
    const userId = await this.getUserId(username);
    const users = await this.db('users');
    const posts = await this.db('posts');
    const comments = await this.db('comments');
    const result = posts.map(({ user_id: postUserId, ...post }) => ({
      ...post,
      user_id: postUserId,
      username: getUsernameById(users, postUserId),
      comments: comments
        .filter(({ post_id: postId }) => post.id === postId)
        .filter(({ status }) => (status === 'actual' || postUserId === userId))
        .map(({ user_id: commentUserId, ...comment }) => ({
          ...comment,
          user_id: commentUserId,
          username: getUsernameById(users, commentUserId),
        })),
    }));

    reply
      .send(result);

    return;
  } catch (error) {
    reply
      .code(500)
      .send({
        error: 'server error',
        detail: error,
      });
  }
}

async function createPost(request, reply) {
  const { body } = request;

  try {
    yup
      .object({
        username: yup.string()
          .required('username is required')
          .max(20, 'username max length is 20'),
        header: yup.string()
          .required('header is required')
          .max(100, 'header max length is 100'),
        text: yup.string()
          .required('text is required')
          .max(255, 'text max length is 255'),
      })
      .validateSync(body);
  } catch ({ message }) {
    reply
      .code(400)
      .send({
        error: 'Invalid query',
        detail: { message },
      });

    return;
  }

  try {
    const { username, ...data } = request.body;
    const userId = await this.getUserId(username);
    const id = await this.db('posts')
      .returning('id')
      .insert({ ...data, user_id: userId });

    reply
      .code(201)
      .send(id);

    return;
  } catch (error) {
    reply
      .code(500)
      .send({
        error: 'server error',
        detail: error,
      });
  }
}

async function deletePost(request, reply) {
  const { postId } = request.params;
  const { username } = request.body;

  try {
    yup.object({
      postId: yup
        .number('postId must be a `number` type')
        .required('postId is required')
        .integer('postId have to be integer')
        .positive('postId have to be positive'),
      username: yup
        .string()
        .required('username is required')
        .max(20, 'username max length is 20'),
    })
      .validateSync({ postId, username });
  } catch ({ message }) {
    reply
      .code(400)
      .send({
        error: 'Invalid query',
        detail: { message },
      });

    return;
  }

  try {
    const userId = await this.getUserId(username);
    const [post] = await this.db('posts').where({ id: postId });

    if (!!post && !!post.user_id && post.user_id !== userId) {
      reply
        .code(403)
        .send({
          error: 'Forbidden',
          detail: { message: 'Post was created by other user' },
        });

      return;
    }

    const deletedPost = await this.db('posts')
      .where({ id: postId, user_id: userId })
      .delete();
    if (deletedPost) {
      await this.db('comments')
        .where({ post_id: postId })
        .delete();
    }

    reply
      .code(204)
      .send();

    return;
  } catch (error) {
    reply
      .code(500)
      .send({
        error: 'server error',
        detail: error,
      });
  }
}

async function createComment(request, reply) {
  const { postId } = request.params;
  const { username, text } = request.body;

  try {
    yup.object({
      postId: yup
        .number('postId must be a `number` type')
        .required('postId is required')
        .integer('postId have to be integer')
        .positive('postId have to be positive'),
      username: yup
        .string()
        .required('username is required')
        .max(20, 'username max length is 20'),
      text: yup.string()
        .required('text is required')
        .max(255, 'text max length is 255'),
    })
      .validateSync({ postId, username, text });
  } catch ({ message }) {
    reply
      .code(400)
      .send({
        error: 'Invalid query',
        detail: { message },
      });

    return;
  }

  try {
    const userId = await this.getUserId(username);
    const [post] = await this.db('posts').where({ id: postId });

    if (!post) {
      reply
        .code(404)
        .send({
          error: 'Not Found',
          detail: { message: "PostId doesn't exist", args: { postId } },
        });

      return;
    }

    const id = await this.db('comments')
      .returning('id')
      .insert({ post_id: postId, user_id: userId, text });

    reply
      .code(201)
      .send(id);

    return;
  } catch (error) {
    reply
      .code(500)
      .send({
        error: 'server error',
        detail: error,
      });
  }
}

async function deleteComment(request, reply) {
  const { postId, commentId } = request.params;
  const { username } = request.body;
  console.log('{ postId, commentId, username }', { postId, commentId, username });
  try {
    yup.object({
      postId: yup
        .number('postId must be a `number` type')
        .required('postId is required')
        .integer('postId have to be integer')
        .positive('postId have to be positive'),
      commentId: yup
        .number('commentId must be a `number` type')
        .required('commentId is required')
        .integer('commentId have to be integer')
        .positive('commentId have to be positive'),
      username: yup
        .string()
        .required('username is required')
        .max(20, 'username max length is 20'),
    })
      .validateSync({ postId, commentId, username });
  } catch ({ message }) {
    reply
      .code(400)
      .send({
        error: 'Invalid query',
        detail: { message },
      });

    return;
  }

  try {
    const userId = await this.getUserId(username);
    const [post] = await this.db('posts').where({ id: postId });
    if (!post) {
      reply
        .code(404)
        .send({
          error: 'Not Found',
          detail: { message: "PostId doesn't exist", args: { postId } },
        });

      return;
    }

    const [comment] = await this.db('comments').where({ id: commentId, post_id: postId });

    if (!!comment && !!comment.user_id && comment.user_id !== userId) {
      reply
        .code(403)
        .send({
          error: 'Forbidden',
          detail: { message: 'Comment was created by other user' },
        });

      return;
    }

    await this.db('comments')
      .where({ id: commentId, post_id: postId, user_id: userId })
      .update({ status: 'deleted' });

    reply
      .code(204)
      .send();

    return;
  } catch (error) {
    reply
      .code(500)
      .send({
        error: 'server error',
        detail: error,
      });
  }
}

module.exports = {
  getPosts, createPost, deletePost, createComment, deleteComment,
};
