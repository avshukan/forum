const ReplyBuilder = require('../../helpers/ReplyBuilder');
const {
  getPosts, createPost, deletePost, createComment, deleteComment,
} = require('../../controllers/postsController');

const serverErrorCases = [
  {
    name: 'getPosts',
    controller: getPosts,
    request: { jwtVerify: () => ({ user: { id: 1 } }) },
  },
  {
    name: 'createPost',
    controller: createPost,
    request: {
      jwtVerify: () => ({ user: { id: 1 } }),
      body: { header: 'Header of the post', text: 'Text of the post' },
    },
  },
  {
    name: 'deletePost',
    controller: deletePost,
    request: { jwtVerify: () => ({ user: { id: 1 } }), params: { postId: 1 } },
  },
  {
    name: 'createComment',
    controller: createComment,
    request: { jwtVerify: () => ({ user: { id: 1 } }), params: { postId: 1 }, body: { text: 'Text of the comment' } },
  },
  {
    name: 'deleteComment',
    controller: deleteComment,
    request: { jwtVerify: () => ({ user: { id: 1 } }), params: { postId: 1, commentId: 1 } },
  },
];

const serverErrorHandler = async ({ controller, request = {} }) => {
  const db = () => { throw new Error('test error'); };
  const log = {
    error: () => { },
  };
  const app = { db, log };

  const reply = new ReplyBuilder();
  await controller.call(app, request, reply);

  const { statusCode, payload } = reply;
  expect(statusCode).toBe(500);
  expect(payload.error).toBe('Server error');
  expect(payload.detail.message).toBe('test error');
};

describe('bad cases with server error (500)', () => {
  test.each(serverErrorCases)('bad case: server error on $name', serverErrorHandler);
});
