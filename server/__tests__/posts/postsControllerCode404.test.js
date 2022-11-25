const _ = require('lodash');
const knex = require('knex');
const knexfile = require('../../knexfile');
const getUserIdByDb = require('../../helpers/getUserIdByDb');
const getTablesLengthChecker = require('../../helpers/getTablesLengthChecker');
const ReplyBuilder = require('../../helpers/ReplyBuilder');
const { createComment, deleteComment } = require('../../controllers/postsController');

const app = {};

beforeEach(async () => {
  const db = knex(knexfile.test);
  await db.migrate.latest();
  await db.seed.run();
  const getUserId = getUserIdByDb(db);
  app.db = db;
  app.getUserId = getUserId;
}, 60000);

describe('postsController', () => {
  describe('createComment', () => {
    it('bad case: known user add comment to non existing post', async () => {
      const tablesLengthChecker = await getTablesLengthChecker(app.db);
      const username = 'Diana';
      const postId = 100;
      const comment = { text: 'Test text' };

      const usersBefore = await app.db('users');
      const postsBefore = await app.db('posts');
      expect(usersBefore.filter((user) => user.username === username).length).toEqual(1);
      expect(postsBefore.filter(({ header }) => header === comment.header).length).toEqual(0);
      expect(postsBefore.filter(({ text }) => text === comment.text).length).toEqual(0);

      const { id: userId } = await app.db('users').where('username', username).first();
      const request = {
        jwtVerify: () => ({ user: { id: userId } }),
        params: { postId },
        body: comment,
      };
      const reply = new ReplyBuilder();
      await createComment.call(app, request, reply);

      const { statusCode, payload } = reply;
      const usersAfter = await app.db('users');
      const commentsAfter = await app.db('comments');

      expect(statusCode).toBe(404);
      expect(payload.error).toBe('Not Found');
      expect(payload.detail.message).toMatch("PostId doesn't exist");

      await tablesLengthChecker(app.db, { usersDelta: 0, postsDelta: 0, commentsDelta: 0 });

      expect(usersAfter.filter((user) => user.username === username).length).toEqual(1);
      expect(commentsAfter.filter(({ text }) => text === comment.text).length).toEqual(0);

      const lastComment = _.last(commentsAfter);
      expect(lastComment).not.toMatchObject(comment);
    });
  });

  /// /////////////////////////////////////////////////////

  describe('deleteComment', () => {
    it('bad case: known user tries delete comment from not existing post', async () => {
      const tablesLengthChecker = await getTablesLengthChecker(app.db);
      const username = 'Alice';
      const postId = 100;
      const commentId = 1;

      const usersBefore = await app.db('users');
      const postsBefore = await app.db('posts');
      const commentsBefore = await app.db('comments');
      expect(usersBefore.filter((user) => user.username === username).length).toEqual(1);
      expect(postsBefore.filter(({ id }) => id === postId).length).toEqual(0);
      expect(commentsBefore.filter(({ id, post_id: pId }) => id === commentId && pId === postId).length).toEqual(0);

      const { id: userId } = await app.db('users').where('username', username).first();
      const request = {
        jwtVerify: () => ({ user: { id: userId } }),
        params: { postId, commentId },
      };
      const reply = new ReplyBuilder();
      await deleteComment.call(app, request, reply);

      const { statusCode, payload } = reply;
      expect(statusCode).toBe(404);
      expect(payload.error).toBe('Not Found');
      expect(payload.detail.message).toMatch("PostId doesn't exist");

      const usersAfter = await app.db('users');
      const postsAfter = await app.db('posts');
      const commentsAfter = await app.db('comments');

      await tablesLengthChecker(app.db, { usersDelta: 0, postsDelta: 0, commentsDelta: 0 });

      expect(usersAfter.filter((user) => user.username === username).length).toEqual(1);
      expect(postsAfter.filter(({ id }) => id === postId).length).toEqual(0);
      expect(commentsAfter.filter(({ id, post_id: pId }) => id === commentId && pId === postId).length).toEqual(0);
    });
  });
});
