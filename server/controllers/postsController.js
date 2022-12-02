const yup = require('yup');
const getUsernameById = require('../helpers/getUsernameById');

const { FRONTEND_ORIGIN } = process.env;

async function getPosts(request, reply) {
  const user = {};

  try {
    const { user: { id } } = await request.jwtVerify();
    user.id = id;
  } catch ({ message }) {
    user.id = 0;
  }

  try {
    const users = await this.db('users');
    const posts = await this.db('posts');
    const comments = await this.db('comments');

    const result = posts.map(({ user_id: postUserId, ...post }) => ({
      ...post,
      user_id: postUserId,
      username: getUsernameById(users, postUserId),
      comments: comments
        .filter(({ post_id: postId }) => post.id === postId)
        .filter(({ status }) => (status === 'actual' || postUserId === user.id))
        .map(({ user_id: commentUserId, ...comment }) => ({
          ...comment,
          user_id: commentUserId,
          username: getUsernameById(users, commentUserId),
        })),
    }));

    reply
      .header('Access-Control-Allow-Origin', FRONTEND_ORIGIN);

    reply
      .send(result);

    return;
  } catch (error) {
    this.log.error({ error: error.message });

    reply
      .code(500)
      .send({
        error: 'Server error',
        detail: error,
      });
  }
}

async function createPost(request, reply) {
  const { body } = request;
  const user = {};

  try {
    const { user: { id } } = await request.jwtVerify();

    if (!id) throw new Error();

    user.id = id;
  } catch ({ message }) {
    reply
      .code(401)
      .send({
        error: 'Not authorized',
        detail: { message: 'bad token' },
      });

    return;
  }

  try {
    yup
      .object({
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
    const { body: { header, text } } = request;
    const id = await this.db('posts')
      .returning('id')
      .insert({ header, text, user_id: user.id });

    reply
      .code(201)
      .send(id);

    return;
  } catch (error) {
    this.log.error({ error: error.message });

    reply
      .code(500)
      .send({
        error: 'Server error',
        detail: error,
      });
  }
}

async function deletePost(request, reply) {
  const { postId } = request.params;
  const user = {};

  try {
    const { user: { id } } = await request.jwtVerify();

    if (!id) throw new Error();

    user.id = id;
  } catch ({ message }) {
    reply
      .code(401)
      .send({
        error: 'Not authorized',
        detail: { message: 'bad token' },
      });

    return;
  }

  try {
    yup.object({
      postId: yup
        .number('postId must be a `number` type')
        .required('postId is required')
        .integer('postId have to be integer')
        .positive('postId have to be positive'),
    })
      .validateSync({ postId });
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
    const [post] = await this.db('posts').where({ id: postId });

    if (!!post && !!post.user_id && post.user_id !== user.id) {
      reply
        .code(403)
        .send({
          error: 'Forbidden',
          detail: { message: 'Post was created by other user' },
        });

      return;
    }

    const deletedPost = await this.db('posts')
      .where({ id: postId, user_id: user.id })
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
    this.log.error({ error: error.message });

    reply
      .code(500)
      .send({
        error: 'Server error',
        detail: error,
      });
  }
}

async function createComment(request, reply) {
  const { postId } = request.params;
  const { text } = request.body;
  const user = {};

  try {
    const { user: { id } } = await request.jwtVerify();

    if (!id) throw new Error();

    user.id = id;
  } catch ({ message }) {
    reply
      .code(401)
      .send({
        error: 'Not authorized',
        detail: { message: 'bad token' },
      });

    return;
  }

  try {
    yup.object({
      postId: yup
        .number('postId must be a `number` type')
        .required('postId is required')
        .integer('postId have to be integer')
        .positive('postId have to be positive'),
      text: yup.string()
        .required('text is required')
        .max(255, 'text max length is 255'),
    })
      .validateSync({ postId, text });
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
      .insert({ post_id: postId, user_id: user.id, text });

    reply
      .code(201)
      .send(id);

    return;
  } catch (error) {
    this.log.error({ error: error.message });

    reply
      .code(500)
      .send({
        error: 'Server error',
        detail: error,
      });
  }
}

async function deleteComment(request, reply) {
  const { postId, commentId } = request.params;
  const user = {};

  try {
    const { user: { id } } = await request.jwtVerify();

    if (!id) throw new Error();

    user.id = id;
  } catch ({ message }) {
    reply
      .code(401)
      .send({
        error: 'Not authorized',
        detail: { message: 'bad token' },
      });

    return;
  }

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
    })
      .validateSync({ postId, commentId });
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

    if (!!comment && !!comment.user_id && comment.user_id !== user.id) {
      reply
        .code(403)
        .send({
          error: 'Forbidden',
          detail: { message: 'Comment was created by other user' },
        });

      return;
    }

    await this.db('comments')
      .where({ id: commentId, post_id: postId, user_id: user.id })
      .update({ status: 'deleted' });

    reply
      .code(204)
      .send();

    return;
  } catch (error) {
    this.log.error({ error: error.message });

    reply
      .code(500)
      .send({
        error: 'Server error',
        detail: error,
      });
  }
}

module.exports = {
  getPosts, createPost, deletePost, createComment, deleteComment,
};
