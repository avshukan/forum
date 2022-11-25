const _ = require('lodash');
const knex = require('knex');
const knexfile = require('../../knexfile');
const getUserIdByDb = require('../../helpers/getUserIdByDb');
const getTablesLengthChecker = require('../../helpers/getTablesLengthChecker');
const ReplyBuilder = require('../../helpers/ReplyBuilder');
const {
  getPosts, createPost, deletePost, createComment, deleteComment,
} = require('../../controllers/postsController');

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
  describe('getPosts', () => {
    it('good case: known user', async () => {
      const tablesLengthChecker = await getTablesLengthChecker(app.db);
      const username = 'Alice';

      const { id: userId } = await app.db('users').where('username', username).first();
      const request = {
        jwtVerify: () => ({ user: { id: userId } }),
      };
      const reply = new ReplyBuilder();
      await getPosts.call(app, request, reply);

      const { statusCode, payload: posts } = reply;
      expect(statusCode).toBe(200);
      expect(posts.length).toBe(3); // posts
      expect(posts[0].comments.map(({ id }) => id)).toEqual([1, 2, 3]); // 1 post comments
      expect(posts[1].comments.map(({ id }) => id)).toEqual([4, 5]); // 2 post comments
      expect(posts[2].comments.map(({ id }) => id)).toEqual([6]); // 3 post comments

      await tablesLengthChecker(app.db, { usersDelta: 0, postsDelta: 0, commentsDelta: 0 });
    });

    it('good case: unknown user', async () => {
      const tablesLengthChecker = await getTablesLengthChecker(app.db);

      const request = {
        jwtVerify: () => ({}),
      };
      const reply = new ReplyBuilder();
      await getPosts.call(app, request, reply);

      const { statusCode, payload: posts } = reply;
      expect(statusCode).toBe(200);
      expect(posts.length).toBe(3); // posts
      expect(posts[0].comments.map(({ id }) => id)).toEqual([1, 2]); // 1 post comments
      expect(posts[1].comments.map(({ id }) => id)).toEqual([4, 5]); // 2 post comments
      expect(posts[2].comments.map(({ id }) => id)).toEqual([6]); // 3 post comments

      await tablesLengthChecker(app.db, { usersDelta: 0, postsDelta: 0, commentsDelta: 0 });
    });
  });

  /// /////////////////////////////////////////////////////

  describe('createPost', () => {
    it('good case: known user', async () => {
      const tablesLengthChecker = await getTablesLengthChecker(app.db);
      const username = 'Diana';
      const post = { header: 'Test header', text: 'Test text' };
      const { id: userId } = await app.db('users').where('username', username).first();

      const usersBefore = await app.db('users');
      const postsBefore = await app.db('posts');
      expect(usersBefore.filter((user) => user.username === username).length).toEqual(1);
      expect(postsBefore.filter(({ header }) => header === post.header).length).toEqual(0);
      expect(postsBefore.filter(({ text }) => text === post.text).length).toEqual(0);

      const request = {
        jwtVerify: () => ({ user: { id: userId } }),
        body: { username, ...post },
      };
      const reply = new ReplyBuilder();
      await createPost.call(app, request, reply);

      const { statusCode, payload } = reply;
      const usersAfter = await app.db('users');
      const postsAfter = await app.db('posts');

      expect(statusCode).toBe(201);
      expect(payload).toMatchObject([{ id: postsAfter.length }]);

      await tablesLengthChecker(app.db, { usersDelta: 0, postsDelta: 1, commentsDelta: 0 });

      expect(usersAfter.filter((user) => user.username === username).length).toEqual(1);
      expect(postsAfter.filter(({ header }) => header === post.header).length).toEqual(1);
      expect(postsAfter.filter(({ text }) => text === post.text).length).toEqual(1);

      const lastPost = _.last(postsAfter);
      const [user] = usersAfter.filter((userAfter) => userAfter.username === username);

      expect(lastPost).toMatchObject(post);
      expect(lastPost.id).toEqual(postsAfter.length);
      expect(lastPost.user_id).toEqual(user.id);
    });
  });

  /// /////////////////////////////////////////////////////

  describe('deletePost', () => {
    it('good case: known user deletes his post', async () => {
      const tablesLengthChecker = await getTablesLengthChecker(app.db);
      const username = 'Barbara';
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
      expect(statusCode).toBe(204);
      expect(payload).toBeUndefined();

      await tablesLengthChecker(app.db, { usersDelta: 0, postsDelta: -1, commentsDelta: -2 });

      const usersAfter = await app.db('users');
      const postsAfter = await app.db('posts');
      const commentsAfter = await app.db('comments');
      expect(usersAfter.filter((user) => user.username === username).length).toEqual(1);
      expect(postsAfter.filter(({ id }) => id === postId).length).toEqual(0);
      expect(commentsAfter.filter(({ post_id: pId }) => pId === postId).length).toEqual(0);
    });
  });

  /// /////////////////////////////////////////////////////

  describe('createComment', () => {
    it('good case: known user add comment to existing post', async () => {
      const tablesLengthChecker = await getTablesLengthChecker(app.db);
      const username = 'Diana';
      const postId = 1;
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

      await tablesLengthChecker(app.db, { usersDelta: 0, postsDelta: 0, commentsDelta: 1 });

      const usersAfter = await app.db('users');
      const commentsAfter = await app.db('comments');

      expect(statusCode).toBe(201);
      expect(payload).toMatchObject([{ id: commentsAfter.length }]);

      expect(usersAfter.filter((user) => user.username === username).length).toEqual(1);
      expect(commentsAfter.filter(({ text }) => text === comment.text).length).toEqual(1);

      const lastComment = _.last(commentsAfter);
      const [user] = usersAfter.filter((userAfter) => userAfter.username === username);
      expect(lastComment).toMatchObject(comment);
      expect(lastComment.id).toEqual(commentsAfter.length);
      expect(lastComment.user_id).toEqual(user.id);
    });
  });

  /// /////////////////////////////////////////////////////

  describe('deleteComment', () => {
    it('good case: known user deletes his comment', async () => {
      const tablesLengthChecker = await getTablesLengthChecker(app.db);
      const username = 'Barbara';
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
      expect(statusCode).toBe(204);
      expect(payload).toBeUndefined();

      await tablesLengthChecker(app.db, { usersDelta: 0, postsDelta: 0, commentsDelta: 0 });

      const usersAfter = await app.db('users');
      const postsAfter = await app.db('posts');
      const commentsAfter = await app.db('comments');
      expect(usersAfter.filter((user) => user.username === username).length).toEqual(1);
      expect(postsAfter.filter(({ id }) => id === postId).length).toEqual(1);
      expect(commentsAfter.filter(({ id, post_id: pId }) => id === commentId && pId === postId).length).toEqual(1);
      const [commentAfter] = commentsAfter.filter(({ id, post_id: pId }) => id === commentId && pId === postId);
      expect(commentAfter.status).toEqual('deleted');
    });

    it('good case: known user tries delete not existing comment', async () => {
      const tablesLengthChecker = await getTablesLengthChecker(app.db);
      const username = 'Barbara';
      const postId = 1;
      const commentId = 100;

      const usersBefore = await app.db('users');
      const postsBefore = await app.db('posts');
      const commentsBefore = await app.db('comments');
      expect(usersBefore.filter((user) => user.username === username).length).toEqual(1);
      expect(postsBefore.filter(({ id }) => id === postId).length).toEqual(1);
      expect(commentsBefore.filter(({ id, post_id: pId }) => id === commentId && pId === postId).length).toEqual(0);

      const { id: userId } = await app.db('users').where('username', username).first();
      const request = {
        jwtVerify: () => ({ user: { id: userId } }),
        params: { postId, commentId },
      };
      const reply = new ReplyBuilder();
      await deleteComment.call(app, request, reply);

      const { statusCode, payload } = reply;
      expect(statusCode).toBe(204);
      expect(payload).toBeUndefined();

      const usersAfter = await app.db('users');
      const postsAfter = await app.db('posts');
      const commentsAfter = await app.db('comments');

      await tablesLengthChecker(app.db, { usersDelta: 0, postsDelta: 0, commentsDelta: 0 });

      expect(usersAfter.filter((user) => user.username === username).length).toEqual(1);
      expect(postsAfter.filter(({ id }) => id === postId).length).toEqual(1);
      expect(commentsAfter.filter(({ id, post_id: pId }) => id === commentId && pId === postId).length).toEqual(0);
    });
  });
});
