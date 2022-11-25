const _ = require('lodash');
const knex = require('knex');
const knexfile = require('../../knexfile');
const getUserIdByDb = require('../../helpers/getUserIdByDb');
const getTablesLengthChecker = require('../../helpers/getTablesLengthChecker');
const ReplyBuilder = require('../../helpers/ReplyBuilder');
const { deletePost, deleteComment } = require('../../controllers/postsController');

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
  describe('deletePost', () => {
    it('bad case: known user cannot delete alien post', async () => {
      const tablesLengthChecker = await getTablesLengthChecker(app.db);
      const username = 'Alice';
      const postId = 2;

      const usersBefore = await app.db('users');
      const postsBefore = await app.db('posts');
      const commentsBefore = await app.db('comments');
      expect(usersBefore.filter((user) => user.username === username).length).toEqual(1);
      expect(postsBefore.filter(({ id }) => id === postId).length).toEqual(1);
      expect(commentsBefore.filter(({ post_id: pId }) => pId === postId).length).toEqual(2);

      const { id: userId } = await app.db('users').where('username', username).first();
      const request = {
        jwtVerify: () => ({ user: { id: userId } }),
        params: { postId },
      };
      const reply = new ReplyBuilder();
      await deletePost.call(app, request, reply);

      const { statusCode, payload } = reply;
      expect(statusCode).toBe(403);
      expect(payload.error).toBe('Forbidden');
      expect(payload.detail.message).toMatch('Post was created by other user');

      await tablesLengthChecker(app.db, { usersDelta: 0, postsDelta: 0, commentsDelta: 0 });

      const usersAfter = await app.db('users');
      const postsAfter = await app.db('posts');
      const commentsAfter = await app.db('comments');

      expect(usersAfter.filter((user) => user.username === username).length).toEqual(1);
      expect(postsAfter.filter(({ id }) => id === postId).length).toEqual(1);
      expect(commentsAfter.filter(({ post_id: pId }) => pId === postId).length).toEqual(2);
    });
  });

  /// /////////////////////////////////////////////////////

  describe('deleteComment', () => {
    it('bad case: known user cannot delete alien comment', async () => {
      const tablesLengthChecker = await getTablesLengthChecker(app.db);
      const username = 'Alice';
      const postId = 1;
      const commentId = 1;

      const usersBefore = await app.db('users');
      const postsBefore = await app.db('posts');
      const commentsBefore = await app.db('comments');
      expect(usersBefore.filter((user) => user.username === username).length).toEqual(1);
      expect(postsBefore.filter(({ id }) => id === postId).length).toEqual(1);
      expect(commentsBefore.filter(({ id, post_id: pId }) => id === commentId && pId === postId).length).toEqual(1);
      const [commentBefore] = commentsBefore.filter(({ id, post_id: pId }) => id === commentId && pId === postId);
      expect(commentBefore.status).toEqual('actual');

      const { id: userId } = await app.db('users').where('username', username).first();
      const request = {
        jwtVerify: () => ({ user: { id: userId } }),
        params: { postId, commentId },
      };
      const reply = new ReplyBuilder();
      await deleteComment.call(app, request, reply);

      const { statusCode, payload } = reply;
      expect(statusCode).toBe(403);
      expect(payload.error).toBe('Forbidden');
      expect(payload.detail.message).toMatch('Comment was created by other user');

      const usersAfter = await app.db('users');
      const postsAfter = await app.db('posts');
      const commentsAfter = await app.db('comments');

      await tablesLengthChecker(app.db, { usersDelta: 0, postsDelta: 0, commentsDelta: 0 });

      expect(usersAfter.filter((user) => user.username === username).length).toEqual(1);
      expect(postsAfter.filter(({ id }) => id === postId).length).toEqual(1);
      expect(commentsAfter.filter(({ id, post_id: pId }) => id === commentId && pId === postId).length).toEqual(1);
      const [commentAfter] = commentsAfter.filter(({ id, post_id: pId }) => id === commentId && pId === postId);
      expect(commentAfter.status).toEqual('actual');
    });
  });
});
