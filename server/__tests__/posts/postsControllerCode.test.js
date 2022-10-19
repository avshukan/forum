const _ = require('lodash');
const knex = require('knex');
const knexfile = require('../../knexfile');
const getUserIdByDb = require('../../helpers/getUserIdByDb');
const { ReplyBuilder } = require('../../helpers/ReplyBuilder');
const {
  getPosts, createPost, deletePost, createComment, deleteComment,
} = require('../../controllers/postsController');

const app = {};

// class TablesLengthCheckerBuilder {
//     constructor(dbBefore) {
//         return (async () => {
//             this.usersBefore = await dbBefore('users');
//             this.postsBefore = await dbBefore('posts');
//             this.commentsBefore = await dbBefore('comments');
//             return this;
//         })();
//     }

//     async check(dbAfter, delta) {
//         const { usersDelta, postsDelta, commentsDelta } = delta;
//         const usersAfter = await dbAfter('users');
//         const postsAfter = await dbAfter('posts');
//         const commentsAfter = await dbAfter('comments');
//         expect(usersAfter.length).toBe(usersBefore.length + usersDelta);
//         expect(postsAfter.length).toBe(postsBefore.length + postsDelta);
//         expect(commentsAfter.length).toBe(commentsBefore.length + commentsDelta);
//     };
// };

// async function getTablesLengthChecker(dbBefore) {
//     const usersBefore = await dbBefore('users');
//     const postsBefore = await dbBefore('posts');
//     const commentsBefore = await dbBefore('comments');

//     async function check(dbAfter, delta) {
//         const { usersDelta, postsDelta, commentsDelta } = delta;
//         const usersAfter = await dbAfter('users');
//         const postsAfter = await dbAfter('posts');
//         const commentsAfter = await dbAfter('comments');
//         expect(usersAfter.length).toBe(usersBefore.length + usersDelta);
//         expect(postsAfter.length).toBe(postsBefore.length + postsDelta);
//         expect(commentsAfter.length).toBe(commentsBefore.length + commentsDelta);
//     };

//     console.log('checker', typeof check)

//     return { check };
// }

beforeEach(async () => {
  const db = knex(knexfile.test);
  await db.migrate.latest();
  await db.seed.run();
  const getUserId = getUserIdByDb(db);
  app.db = db;
  app.getUserId = getUserId;
});

describe('postsController', () => {
  describe('getPosts', () => {
    it('good case: known user', async () => {
      // const tablesLengthChecker = new TablesLengthCheckerBuilder(app.db);
      // console.log('tablesLengthChecker', typeof tablesLengthChecker)
      const username = 'Alice';

      const usersBefore = await app.db('users');
      const postsBefore = await app.db('posts');
      const commentsBefore = await app.db('comments');
      expect(usersBefore.filter((user) => user.username === username).length).toEqual(1);

      const request = { query: { username } };
      const reply = new ReplyBuilder();
      await getPosts.call(app, request, reply);

      const { statusCode, payload: posts } = reply;
      expect(statusCode).toBe(200);
      expect(posts.length).toBe(3); // posts
      expect(posts[0].comments.map(({ id }) => id)).toEqual([1, 2, 3]); // 1 post comments
      expect(posts[1].comments.map(({ id }) => id)).toEqual([4, 5]); // 2 post comments
      expect(posts[2].comments.map(({ id }) => id)).toEqual([6]); // 3 post comments

      const usersAfter = await app.db('users');
      const postsAfter = await app.db('posts');
      const commentsAfter = await app.db('comments');
      expect(usersAfter.length).toBe(usersBefore.length);
      expect(postsAfter.length).toBe(postsBefore.length);
      expect(commentsAfter.length).toBe(commentsBefore.length);
      expect(usersAfter.filter((user) => user.username === username).length).toEqual(1);
      // await tablesLengthChecker.check(app.db, { usersDelta: 0, postsDelta: 0, commentsDelta: 0 });
    });

    it('good case: unknown user', async () => {
      const username = 'Helen';

      const usersBefore = await app.db('users');
      const postsBefore = await app.db('posts');
      const commentsBefore = await app.db('comments');
      expect(usersBefore.filter((user) => user.username === username).length).toEqual(0);

      const request = { query: { username } };
      const reply = new ReplyBuilder();
      await getPosts.call(app, request, reply);

      const { statusCode, payload: posts } = reply;
      expect(statusCode).toBe(200);
      expect(posts.length).toBe(3); // posts
      expect(posts[0].comments.map(({ id }) => id)).toEqual([1, 2]); // 1 post comments
      expect(posts[1].comments.map(({ id }) => id)).toEqual([4, 5]); // 2 post comments
      expect(posts[2].comments.map(({ id }) => id)).toEqual([6]); // 3 post comments

      const usersAfter = await app.db('users');
      const postsAfter = await app.db('posts');
      const commentsAfter = await app.db('comments');
      expect(usersAfter.length).toBe(usersBefore.length + 1);
      expect(postsAfter.length).toBe(postsBefore.length);
      expect(commentsAfter.length).toBe(commentsBefore.length);
      expect(usersAfter.filter((user) => user.username === username).length).toEqual(1);
    });
  });

  /// ////////////////////////////////////////////////////////

  describe('createPost', () => {
    it('good case: known user', async () => {
      const username = 'Diana';
      post = { header: 'Test header', text: 'Test text' };

      const usersBefore = await app.db('users');
      const postsBefore = await app.db('posts');
      const commentsBefore = await app.db('comments');
      expect(usersBefore.filter((user) => user.username === username).length).toEqual(1);
      expect(postsBefore.filter(({ header }) => header === post.header).length).toEqual(0);
      expect(postsBefore.filter(({ text }) => text === post.text).length).toEqual(0);

      const request = { body: { username, ...post } };
      const reply = new ReplyBuilder();
      await createPost.call(app, request, reply);

      const { statusCode, payload } = reply;
      const usersAfter = await app.db('users');
      const postsAfter = await app.db('posts');
      const commentsAfter = await app.db('comments');

      expect(statusCode).toBe(201);
      expect(payload).toMatchObject([{ id: postsAfter.length }]);

      expect(usersAfter.length).toBe(usersBefore.length);
      expect(postsAfter.length).toBe(postsBefore.length + 1);
      expect(commentsAfter.length).toBe(commentsBefore.length);

      expect(usersAfter.filter((user) => user.username === username).length).toEqual(1);
      expect(postsAfter.filter(({ header }) => header === post.header).length).toEqual(1);
      expect(postsAfter.filter(({ text }) => text === post.text).length).toEqual(1);

      const lastPost = _.last(postsAfter);
      const [user] = usersAfter.filter((user) => user.username === username);

      expect(lastPost).toMatchObject(post);
      expect(lastPost.id).toEqual(postsAfter.length);
      expect(lastPost.user_id).toEqual(user.id);
    });

    it('good case: unknown user', async () => {
      const username = 'Helen';
      post = { header: 'Test header', text: 'Test text' };

      const usersBefore = await app.db('users');
      const postsBefore = await app.db('posts');
      const commentsBefore = await app.db('comments');
      expect(usersBefore.filter((user) => user.username === username).length).toEqual(0);
      expect(postsBefore.filter(({ header }) => header === post.header).length).toEqual(0);
      expect(postsBefore.filter(({ text }) => text === post.text).length).toEqual(0);

      const request = { body: { username, ...post } };
      const reply = new ReplyBuilder();
      await createPost.call(app, request, reply);

      const { statusCode, payload } = reply;
      const usersAfter = await app.db('users');
      const postsAfter = await app.db('posts');
      const commentsAfter = await app.db('comments');
      expect(statusCode).toBe(201);
      expect(payload).toMatchObject([{ id: postsAfter.length }]);

      expect(usersAfter.length).toBe(usersBefore.length + 1);
      expect(postsAfter.length).toBe(postsBefore.length + 1);
      expect(commentsAfter.length).toBe(commentsBefore.length);

      expect(usersAfter.filter((user) => user.username === username).length).toEqual(1);
      expect(postsAfter.filter(({ header }) => header === post.header).length).toEqual(1);
      expect(postsAfter.filter(({ text }) => text === post.text).length).toEqual(1);

      const lastPost = _.last(postsAfter);
      const [user] = usersAfter.filter((user) => user.username === username);
      expect(lastPost).toMatchObject(post);
      expect(lastPost.id).toEqual(postsAfter.length);
      expect(lastPost.user_id).toEqual(user.id);
    });
  });

  /// ////////////////////////////////////////////////////////

  describe('deletePost', () => {
    it('good case: known user deletes his post', async () => {
      const username = 'Barbara';
      postId = 2;

      const usersBefore = await app.db('users');
      const postsBefore = await app.db('posts');
      const commentsBefore = await app.db('comments');
      expect(usersBefore.filter((user) => user.username === username).length).toEqual(1);
      expect(postsBefore.filter(({ id }) => id === postId).length).toEqual(1);
      expect(commentsBefore.filter(({ post_id }) => post_id === postId).length).toEqual(2);

      const request = { params: { postId }, body: { username, ...post } };
      const reply = new ReplyBuilder();
      await deletePost.call(app, request, reply);

      const { statusCode, payload } = reply;
      expect(statusCode).toBe(204);
      expect(payload).toBeUndefined();

      const usersAfter = await app.db('users');
      const postsAfter = await app.db('posts');
      const commentsAfter = await app.db('comments');

      expect(usersAfter.length).toBe(usersBefore.length);
      expect(postsAfter.length).toBe(postsBefore.length - 1);
      expect(commentsAfter.length).toBe(commentsBefore.length - 2);

      expect(usersAfter.filter((user) => user.username === username).length).toEqual(1);
      expect(postsAfter.filter(({ id }) => id === postId).length).toEqual(0);
      expect(commentsAfter.filter(({ post_id }) => post_id === postId).length).toEqual(0);
    });

    it('bad case: known user cannot delete alien post', async () => {
      const username = 'Alice';
      postId = 2;

      const usersBefore = await app.db('users');
      const postsBefore = await app.db('posts');
      const commentsBefore = await app.db('comments');
      expect(usersBefore.filter((user) => user.username === username).length).toEqual(1);
      expect(postsBefore.filter(({ id }) => id === postId).length).toEqual(1);
      expect(commentsBefore.filter(({ post_id }) => post_id === postId).length).toEqual(2);

      const request = { params: { postId }, body: { username, ...post } };
      const reply = new ReplyBuilder();
      await deletePost.call(app, request, reply);

      const { statusCode, payload } = reply;
      expect(statusCode).toBe(403);
      expect(payload.error).toBe('Forbidden');
      expect(payload.detail.message).toMatch('Post was created by other user');

      const usersAfter = await app.db('users');
      const postsAfter = await app.db('posts');
      const commentsAfter = await app.db('comments');

      expect(usersAfter.length).toBe(usersBefore.length);
      expect(postsAfter.length).toBe(postsBefore.length);
      expect(commentsAfter.length).toBe(commentsBefore.length);

      expect(usersAfter.filter((user) => user.username === username).length).toEqual(1);
      expect(postsAfter.filter(({ id }) => id === postId).length).toEqual(1);
      expect(commentsAfter.filter(({ post_id }) => post_id === postId).length).toEqual(2);
    });

    it('bad case: unknown user cannot delete any post', async () => {
      const username = 'Kate';
      postId = 2;

      const usersBefore = await app.db('users');
      const postsBefore = await app.db('posts');
      const commentsBefore = await app.db('comments');
      expect(usersBefore.filter((user) => user.username === username).length).toEqual(0);
      expect(postsBefore.filter(({ id }) => id === postId).length).toEqual(1);
      expect(commentsBefore.filter(({ post_id }) => post_id === postId).length).toEqual(2);

      const request = { params: { postId }, body: { username, ...post } };
      const reply = new ReplyBuilder();
      await deletePost.call(app, request, reply);

      const { statusCode, payload } = reply;
      expect(statusCode).toBe(403);
      expect(payload.error).toBe('Forbidden');
      expect(payload.detail.message).toMatch('Post was created by other user');

      const usersAfter = await app.db('users');
      const postsAfter = await app.db('posts');
      const commentsAfter = await app.db('comments');

      expect(usersAfter.length).toBe(usersBefore.length + 1);
      expect(postsAfter.length).toBe(postsBefore.length);
      expect(commentsAfter.length).toBe(commentsBefore.length);

      expect(usersAfter.filter((user) => user.username === username).length).toEqual(1);
      expect(postsAfter.filter(({ id }) => id === postId).length).toEqual(1);
      expect(commentsAfter.filter(({ post_id }) => post_id === postId).length).toEqual(2);
    });
  });

  /// ////////////////////////////////////////////////////////

  describe('createComment', () => {
    it('good case: known user add comment to existing post', async () => {
      const username = 'Diana';
      const postId = 1;
      const comment = { text: 'Test text' };

      const usersBefore = await app.db('users');
      const postsBefore = await app.db('posts');
      const commentsBefore = await app.db('comments');
      expect(usersBefore.filter((user) => user.username === username).length).toEqual(1);
      expect(postsBefore.filter(({ header }) => header === post.header).length).toEqual(0);
      expect(postsBefore.filter(({ text }) => text === post.text).length).toEqual(0);

      const request = { params: { postId }, body: { username, ...comment } };
      const reply = new ReplyBuilder();
      await createComment.call(app, request, reply);

      const { statusCode, payload } = reply;
      const usersAfter = await app.db('users');
      const postsAfter = await app.db('posts');
      const commentsAfter = await app.db('comments');

      expect(statusCode).toBe(201);

      expect(payload).toMatchObject([{ id: commentsAfter.length }]);

      expect(usersAfter.length).toBe(usersBefore.length);
      expect(postsAfter.length).toBe(postsBefore.length);
      expect(commentsAfter.length).toBe(commentsBefore.length + 1);

      expect(usersAfter.filter((user) => user.username === username).length).toEqual(1);
      expect(commentsAfter.filter(({ text }) => text === comment.text).length).toEqual(1);

      const lastComment = _.last(commentsAfter);
      const [user] = usersAfter.filter((user) => user.username === username);

      expect(lastComment).toMatchObject(comment);
      expect(lastComment.id).toEqual(commentsAfter.length);
      expect(lastComment.user_id).toEqual(user.id);
    });

    it('good case: unknown user add comment to existing post', async () => {
      const username = 'Samanta';
      const postId = 1;
      const comment = { text: 'Test text' };

      const usersBefore = await app.db('users');
      const postsBefore = await app.db('posts');
      const commentsBefore = await app.db('comments');
      expect(usersBefore.filter((user) => user.username === username).length).toEqual(0);
      expect(postsBefore.filter(({ header }) => header === post.header).length).toEqual(0);
      expect(postsBefore.filter(({ text }) => text === post.text).length).toEqual(0);

      const request = { params: { postId }, body: { username, ...comment } };
      const reply = new ReplyBuilder();
      await createComment.call(app, request, reply);

      const { statusCode, payload } = reply;
      const usersAfter = await app.db('users');
      const postsAfter = await app.db('posts');
      const commentsAfter = await app.db('comments');

      expect(statusCode).toBe(201);
      expect(payload).toMatchObject([{ id: commentsAfter.length }]);

      expect(usersAfter.length).toBe(usersBefore.length + 1);
      expect(postsAfter.length).toBe(postsBefore.length);
      expect(commentsAfter.length).toBe(commentsBefore.length + 1);

      expect(usersAfter.filter((user) => user.username === username).length).toEqual(1);
      expect(commentsAfter.filter(({ text }) => text === comment.text).length).toEqual(1);

      const lastComment = _.last(commentsAfter);
      const [user] = usersAfter.filter((user) => user.username === username);

      expect(lastComment).toMatchObject(comment);
      expect(lastComment.id).toEqual(commentsAfter.length);
      expect(lastComment.user_id).toEqual(user.id);
    });

    it('bad case: known user add comment to non existing post', async () => {
      const username = 'Diana';
      const postId = 100;
      const comment = { text: 'Test text' };

      const usersBefore = await app.db('users');
      const postsBefore = await app.db('posts');
      const commentsBefore = await app.db('comments');
      expect(usersBefore.filter((user) => user.username === username).length).toEqual(1);
      expect(postsBefore.filter(({ header }) => header === post.header).length).toEqual(0);
      expect(postsBefore.filter(({ text }) => text === post.text).length).toEqual(0);

      const request = { params: { postId }, body: { username, ...comment } };
      const reply = new ReplyBuilder();
      await createComment.call(app, request, reply);

      const { statusCode, payload } = reply;
      const usersAfter = await app.db('users');
      const postsAfter = await app.db('posts');
      const commentsAfter = await app.db('comments');

      expect(statusCode).toBe(404);
      expect(payload.error).toBe('Not Found');
      expect(payload.detail.message).toMatch("PostId doesn't exist");

      expect(usersAfter.length).toBe(usersBefore.length);
      expect(postsAfter.length).toBe(postsBefore.length);
      expect(commentsAfter.length).toBe(commentsBefore.length);

      expect(usersAfter.filter((user) => user.username === username).length).toEqual(1);
      expect(commentsAfter.filter(({ text }) => text === comment.text).length).toEqual(0);

      const lastComment = _.last(commentsAfter);
      const [user] = usersAfter.filter((user) => user.username === username);

      expect(lastComment).not.toMatchObject(post);
    });

    it('bad case: unknown user add comment to non existing post', async () => {
      const username = 'Trisha';
      const postId = 100;
      const comment = { text: 'Test text' };

      const usersBefore = await app.db('users');
      const postsBefore = await app.db('posts');
      const commentsBefore = await app.db('comments');
      expect(usersBefore.filter((user) => user.username === username).length).toEqual(0);
      expect(postsBefore.filter(({ header }) => header === post.header).length).toEqual(0);
      expect(postsBefore.filter(({ text }) => text === post.text).length).toEqual(0);

      const request = { params: { postId }, body: { username, ...comment } };
      const reply = new ReplyBuilder();
      await createComment.call(app, request, reply);

      const { statusCode, payload } = reply;
      const usersAfter = await app.db('users');
      const postsAfter = await app.db('posts');
      const commentsAfter = await app.db('comments');

      expect(statusCode).toBe(404);
      expect(payload.error).toBe('Not Found');
      expect(payload.detail.message).toMatch("PostId doesn't exist");

      expect(usersAfter.length).toBe(usersBefore.length + 1);
      expect(postsAfter.length).toBe(postsBefore.length);
      expect(commentsAfter.length).toBe(commentsBefore.length);

      expect(usersAfter.filter((user) => user.username === username).length).toEqual(1);
      expect(commentsAfter.filter(({ text }) => text === comment.text).length).toEqual(0);

      const lastComment = _.last(commentsAfter);
      const [user] = usersAfter.filter((user) => user.username === username);

      expect(lastComment).not.toMatchObject(post);
    });
  });

  /// ////////////////////////////////////////////////////////

  describe('deleteComment', () => {
    it('good case: known user deletes his comment', async () => {
      const username = 'Barbara';
      postId = 1;
      commentId = 1;

      const usersBefore = await app.db('users');
      const postsBefore = await app.db('posts');
      const commentsBefore = await app.db('comments');
      expect(usersBefore.filter((user) => user.username === username).length).toEqual(1);
      expect(postsBefore.filter(({ id }) => id === postId).length).toEqual(1);
      expect(commentsBefore.filter(({ id, post_id }) => id === commentId && post_id === postId).length).toEqual(1);
      const [commentBefore] = commentsBefore.filter(({ id, post_id }) => id === commentId && post_id === postId);
      expect(commentBefore.status).toEqual('actual');

      const request = { params: { postId, commentId }, body: { username } };
      const reply = new ReplyBuilder();
      await deleteComment.call(app, request, reply);

      const { statusCode, payload } = reply;
      expect(statusCode).toBe(204);
      expect(payload).toBeUndefined();

      const usersAfter = await app.db('users');
      const postsAfter = await app.db('posts');
      const commentsAfter = await app.db('comments');

      expect(usersAfter.length).toBe(usersBefore.length);
      expect(postsAfter.length).toBe(postsBefore.length);
      expect(commentsAfter.length).toBe(commentsBefore.length);

      expect(usersAfter.filter((user) => user.username === username).length).toEqual(1);
      expect(postsAfter.filter(({ id }) => id === postId).length).toEqual(1);
      expect(commentsAfter.filter(({ id, post_id }) => id === commentId && post_id === postId).length).toEqual(1);
      const [commentAfter] = commentsAfter.filter(({ id, post_id }) => id === commentId && post_id === postId);
      expect(commentAfter.status).toEqual('deleted');
    });

    it('bad case: known user tryes delete alien comment', async () => {
      const username = 'Alice';
      postId = 1;
      commentId = 1;

      const usersBefore = await app.db('users');
      const postsBefore = await app.db('posts');
      const commentsBefore = await app.db('comments');
      expect(usersBefore.filter((user) => user.username === username).length).toEqual(1);
      expect(postsBefore.filter(({ id }) => id === postId).length).toEqual(1);
      expect(commentsBefore.filter(({ id, post_id }) => id === commentId && post_id === postId).length).toEqual(1);
      const [commentBefore] = commentsBefore.filter(({ id, post_id }) => id === commentId && post_id === postId);
      expect(commentBefore.status).toEqual('actual');

      const request = { params: { postId, commentId }, body: { username } };
      const reply = new ReplyBuilder();
      await deleteComment.call(app, request, reply);

      const { statusCode, payload } = reply;
      expect(statusCode).toBe(403);
      expect(payload.error).toBe('Forbidden');
      expect(payload.detail.message).toMatch('Comment was created by other user');

      const usersAfter = await app.db('users');
      const postsAfter = await app.db('posts');
      const commentsAfter = await app.db('comments');

      expect(usersAfter.length).toBe(usersBefore.length);
      expect(postsAfter.length).toBe(postsBefore.length);
      expect(commentsAfter.length).toBe(commentsBefore.length);

      expect(usersAfter.filter((user) => user.username === username).length).toEqual(1);
      expect(postsAfter.filter(({ id }) => id === postId).length).toEqual(1);
      expect(commentsAfter.filter(({ id, post_id }) => id === commentId && post_id === postId).length).toEqual(1);
      const [commentAfter] = commentsAfter.filter(({ id, post_id }) => id === commentId && post_id === postId);
      expect(commentAfter.status).toEqual('actual');
    });

    it('bad case: known user tryes delete comment from not existing post', async () => {
      const username = 'Alice';
      postId = 100;
      commentId = 1;

      const usersBefore = await app.db('users');
      const postsBefore = await app.db('posts');
      const commentsBefore = await app.db('comments');
      expect(usersBefore.filter((user) => user.username === username).length).toEqual(1);
      expect(postsBefore.filter(({ id }) => id === postId).length).toEqual(0);
      expect(commentsBefore.filter(({ id, post_id }) => id === commentId && post_id === postId).length).toEqual(0);

      const request = { params: { postId, commentId }, body: { username } };
      const reply = new ReplyBuilder();
      await deleteComment.call(app, request, reply);

      const { statusCode, payload } = reply;
      expect(statusCode).toBe(404);
      expect(payload.error).toBe('Not Found');
      expect(payload.detail.message).toMatch("PostId doesn't exist");

      const usersAfter = await app.db('users');
      const postsAfter = await app.db('posts');
      const commentsAfter = await app.db('comments');

      expect(usersAfter.length).toBe(usersBefore.length);
      expect(postsAfter.length).toBe(postsBefore.length);
      expect(commentsAfter.length).toBe(commentsBefore.length);

      expect(usersAfter.filter((user) => user.username === username).length).toEqual(1);
      expect(postsAfter.filter(({ id }) => id === postId).length).toEqual(0);
      expect(commentsAfter.filter(({ id, post_id }) => id === commentId && post_id === postId).length).toEqual(0);
    });

    it('good case: known user tryes delete not existing comment', async () => {
      const username = 'Barbara';
      postId = 1;
      commentId = 100;

      const usersBefore = await app.db('users');
      const postsBefore = await app.db('posts');
      const commentsBefore = await app.db('comments');
      expect(usersBefore.filter((user) => user.username === username).length).toEqual(1);
      expect(postsBefore.filter(({ id }) => id === postId).length).toEqual(1);
      expect(commentsBefore.filter(({ id, post_id }) => id === commentId && post_id === postId).length).toEqual(0);

      const request = { params: { postId, commentId }, body: { username } };
      const reply = new ReplyBuilder();
      await deleteComment.call(app, request, reply);

      const { statusCode, payload } = reply;
      expect(statusCode).toBe(204);
      expect(payload).toBeUndefined();

      const usersAfter = await app.db('users');
      const postsAfter = await app.db('posts');
      const commentsAfter = await app.db('comments');

      expect(usersAfter.length).toBe(usersBefore.length);
      expect(postsAfter.length).toBe(postsBefore.length);
      expect(commentsAfter.length).toBe(commentsBefore.length);

      expect(usersAfter.filter((user) => user.username === username).length).toEqual(1);
      expect(postsAfter.filter(({ id }) => id === postId).length).toEqual(1);
      expect(commentsAfter.filter(({ id, post_id }) => id === commentId && post_id === postId).length).toEqual(0);
    });

    it('bad case: unknown user tryes delete any comment', async () => {
      const username = 'Zendaya';
      postId = 1;
      commentId = 1;

      const usersBefore = await app.db('users');
      const postsBefore = await app.db('posts');
      const commentsBefore = await app.db('comments');
      expect(usersBefore.filter((user) => user.username === username).length).toEqual(0);
      expect(postsBefore.filter(({ id }) => id === postId).length).toEqual(1);
      expect(commentsBefore.filter(({ id, post_id }) => id === commentId && post_id === postId).length).toEqual(1);
      const [commentBefore] = commentsBefore.filter(({ id, post_id }) => id === commentId && post_id === postId);
      expect(commentBefore.status).toEqual('actual');

      const request = { params: { postId, commentId }, body: { username } };
      const reply = new ReplyBuilder();
      await deleteComment.call(app, request, reply);

      const { statusCode, payload } = reply;
      expect(statusCode).toBe(403);
      expect(payload.error).toBe('Forbidden');
      expect(payload.detail.message).toMatch('Comment was created by other user');

      const usersAfter = await app.db('users');
      const postsAfter = await app.db('posts');
      const commentsAfter = await app.db('comments');

      expect(usersAfter.length).toBe(usersBefore.length + 1);
      expect(postsAfter.length).toBe(postsBefore.length);
      expect(commentsAfter.length).toBe(commentsBefore.length);

      expect(usersAfter.filter((user) => user.username === username).length).toEqual(1);
      expect(postsAfter.filter(({ id }) => id === postId).length).toEqual(1);
      expect(commentsAfter.filter(({ id, post_id }) => id === commentId && post_id === postId).length).toEqual(1);
      const [commentAfter] = commentsAfter.filter(({ id, post_id }) => id === commentId && post_id === postId);
      expect(commentAfter.status).toEqual('actual');
    });

    it('bad case: unknown user tryes delete comment from not existing post', async () => {
      const username = 'Zendaya';
      postId = 100;
      commentId = 1;

      const usersBefore = await app.db('users');
      const postsBefore = await app.db('posts');
      const commentsBefore = await app.db('comments');
      expect(usersBefore.filter((user) => user.username === username).length).toEqual(0);
      expect(postsBefore.filter(({ id }) => id === postId).length).toEqual(0);
      expect(commentsBefore.filter(({ id, post_id }) => id === commentId && post_id === postId).length).toEqual(0);

      const request = { params: { postId, commentId }, body: { username } };
      const reply = new ReplyBuilder();
      await deleteComment.call(app, request, reply);

      const { statusCode, payload } = reply;
      expect(statusCode).toBe(404);
      expect(payload.error).toBe('Not Found');
      expect(payload.detail.message).toMatch("PostId doesn't exist");

      const usersAfter = await app.db('users');
      const postsAfter = await app.db('posts');
      const commentsAfter = await app.db('comments');

      expect(usersAfter.length).toBe(usersBefore.length + 1);
      expect(postsAfter.length).toBe(postsBefore.length);
      expect(commentsAfter.length).toBe(commentsBefore.length);

      expect(usersAfter.filter((user) => user.username === username).length).toEqual(1);
      expect(postsAfter.filter(({ id }) => id === postId).length).toEqual(0);
      expect(commentsAfter.filter(({ id, post_id }) => id === commentId && post_id === postId).length).toEqual(0);
    });

    it('good case: unknown user tryes delete not existing comment', async () => {
      const username = 'Zendaya';
      postId = 1;
      commentId = 100;

      const usersBefore = await app.db('users');
      const postsBefore = await app.db('posts');
      const commentsBefore = await app.db('comments');
      expect(usersBefore.filter((user) => user.username === username).length).toEqual(0);
      expect(postsBefore.filter(({ id }) => id === postId).length).toEqual(1);
      expect(commentsBefore.filter(({ id, post_id }) => id === commentId && post_id === postId).length).toEqual(0);

      const request = { params: { postId, commentId }, body: { username } };
      const reply = new ReplyBuilder();
      await deleteComment.call(app, request, reply);

      const { statusCode, payload } = reply;
      expect(statusCode).toBe(204);
      expect(payload).toBeUndefined();

      const usersAfter = await app.db('users');
      const postsAfter = await app.db('posts');
      const commentsAfter = await app.db('comments');

      expect(usersAfter.length).toBe(usersBefore.length + 1);
      expect(postsAfter.length).toBe(postsBefore.length);
      expect(commentsAfter.length).toBe(commentsBefore.length);

      expect(usersAfter.filter((user) => user.username === username).length).toEqual(1);
      expect(postsAfter.filter(({ id }) => id === postId).length).toEqual(1);
      expect(commentsAfter.filter(({ id, post_id }) => id === commentId && post_id === postId).length).toEqual(0);
    });
  });
});
