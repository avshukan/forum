const knex = require('knex');
const knexfile = require('../../knexfile');
const getUserIdByDb = require('../../helpers/getUserIdByDb');
const ReplyBuilder = require('../../helpers/ReplyBuilder');
const {
  createPost, deletePost, createComment, deleteComment,
} = require('../../controllers/postsController');

const app = {};

const badRequestCases = [
  {
    name: 'createPost',
    controller: createPost,
    decodedToken: { user: { id: 1 } },
    body: { header: '' },
    message: 'header is required',
  },
  {
    name: 'createPost',
    controller: createPost,
    decodedToken: { user: { id: 1 } },
    body: { header: 'a'.repeat(10000) },
    message: 'header max length is 100',
  },
  {
    name: 'createPost',
    controller: createPost,
    decodedToken: { user: { id: 1 } },
    body: { text: '' },
    message: 'text is required',
  },
  {
    name: 'createPost',
    controller: createPost,
    decodedToken: { user: { id: 1 } },
    body: { text: 'a'.repeat(10000) },
    message: 'text max length is 255',
  },

  {
    name: 'deletePost',
    decodedToken: { user: { id: 1 } },
    controller: deletePost,
    message: 'postId is required',
  },
  {
    name: 'deletePost',
    decodedToken: { user: { id: 1 } },
    controller: deletePost,
    params: { postId: 'string' },
    message: 'postId must be a `number` type',
  },
  {
    name: 'deletePost',
    decodedToken: { user: { id: 1 } },
    controller: deletePost,
    params: { postId: 5 / 2 },
    message: 'postId have to be integer',
  },
  {
    name: 'deletePost',
    decodedToken: { user: { id: 1 } },
    controller: deletePost,
    params: { postId: -3 },
    message: 'postId have to be positive',
  },

  {
    name: 'createComment',
    controller: createComment,
    decodedToken: { user: { id: 1 } },
    params: { commentId: 1 },
    message: 'postId is required',
  },
  {
    name: 'createComment',
    controller: createComment,
    decodedToken: { user: { id: 1 } },
    params: { postId: 'string', commentId: 1 },
    message: 'postId must be a `number` type',
  },
  {
    name: 'createComment',
    controller: createComment,
    decodedToken: { user: { id: 1 } },
    params: { postId: 5 / 2, commentId: 1 },
    message: 'postId have to be integer',
  },
  {
    name: 'createComment',
    controller: createComment,
    decodedToken: { user: { id: 1 } },
    params: { postId: -3, commentId: 1 },
    message: 'postId have to be positive',
  },
  {
    name: 'createComment',
    controller: createComment,
    decodedToken: { user: { id: 1 } },
    params: { postId: 1, commentId: 1 },
    body: { text: '' },
    message: 'text is required',
  },
  {
    name: 'createComment',
    controller: createComment,
    decodedToken: { user: { id: 1 } },
    params: { postId: 1, commentId: 1 },
    body: { text: 'a'.repeat(10000) },
    message: 'text max length is 255',
  },

  {
    name: 'deleteComment',
    controller: deleteComment,
    decodedToken: { user: { id: 1 } },
    params: { commentId: 1 },
    message: 'postId is required',
  },
  {
    name: 'deleteComment',
    controller: deleteComment,
    decodedToken: { user: { id: 1 } },
    params: { postId: 'string', commentId: 1 },
    message: 'postId must be a `number` type',
  },
  {
    name: 'deleteComment',
    controller: deleteComment,
    decodedToken: { user: { id: 1 } },
    params: { postId: 5 / 2, commentId: 1 },
    message: 'postId have to be integer',
  },
  {
    name: 'deleteComment',
    controller: deleteComment,
    decodedToken: { user: { id: 1 } },
    params: { postId: -3, commentId: 1 },
    message: 'postId have to be positive',
  },
  {
    name: 'deleteComment',
    controller: deleteComment,
    decodedToken: { user: { id: 1 } },
    params: { postId: 1 },
    message: 'commentId is required',
  },
  {
    name: 'deleteComment',
    controller: deleteComment,
    decodedToken: { user: { id: 1 } },
    params: { postId: 1, commentId: { x: 3 } },
    message: 'commentId must be a `number` type',
  },
  {
    name: 'deleteComment',
    controller: deleteComment,
    decodedToken: { user: { id: 1 } },
    params: { postId: 1, commentId: 1 / 2 },
    message: 'commentId have to be integer',
  },
  {
    name: 'deleteComment',
    controller: deleteComment,
    decodedToken: { user: { id: 1 } },
    params: { postId: 1, commentId: -1 },
    message: 'commentId have to be positive',
  },
];

const badRequestHandler = async ({
  controller, decodedToken, query = {}, params = {}, body = {}, message,
}) => {
  const usersBefore = await app.db('users');
  const postsBefore = await app.db('posts');
  const commentsBefore = await app.db('comments');

  const request = {
    jwtVerify: () => decodedToken,
    query: { ...query },
    params: { ...params },
    body: {
      username: 'Zendaya',
      header: 'Zendaya header',
      text: 'Zendaya text',
      ...body,
    },
  };
  const reply = new ReplyBuilder();
  await controller.call(app, request, reply);

  const { statusCode, payload } = reply;
  expect(statusCode).toBe(400);
  expect(payload.error).toBe('Invalid query');
  expect(payload.detail.message).toMatch(message);
  const usersAfter = await app.db('users');
  const postsAfter = await app.db('posts');
  const commentsAfter = await app.db('comments');
  expect(usersAfter.length).toBe(usersBefore.length);
  expect(postsAfter.length).toBe(postsBefore.length);
  expect(commentsAfter.length).toBe(commentsBefore.length);
};

beforeEach(async () => {
  const db = knex(knexfile.test);
  await db.migrate.latest();
  await db.seed.run();
  const getUserId = getUserIdByDb(db);
  app.db = db;
  app.getUserId = getUserId;
}, 60000);

describe('bad cases with bad request (400)', () => {
  test.each(badRequestCases)('bad case: $name ($message)', badRequestHandler);
});

test.todo('test 400');
