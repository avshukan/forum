const knex = require('knex');
const knexfile = require('../../knexfile');
const ReplyBuilder = require('../../helpers/ReplyBuilder');
const {
  createPost, deletePost, createComment, deleteComment,
} = require('../../controllers/postsController');

const app = {};

const badRequestCases = [
  {
    name: 'createPost',
    controller: createPost,
    decodedToken: { user: {} },
    message: 'bad token',
  },
  {
    name: 'createPost',
    controller: createPost,
    decodedToken: {},
    message: 'bad token',
  },

  {
    name: 'deletePost',
    controller: deletePost,
    decodedToken: { user: {} },
    message: 'bad token',
  },
  {
    name: 'deletePost',
    controller: deletePost,
    decodedToken: {},
    message: 'bad token',
  },

  {
    name: 'createComment',
    controller: createComment,
    decodedToken: { user: {} },
    message: 'bad token',
  },

  {
    name: 'deleteComment',
    controller: deleteComment,
    decodedToken: { user: {} },
    message: 'bad token',
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
  expect(statusCode).toBe(401);
  expect(payload.error).toBe('Not authorized');
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
  app.db = db;
}, 60000);

describe('bad cases with bad request (400)', () => {
  test.each(badRequestCases)('bad case: $name ($message)', badRequestHandler);
});
