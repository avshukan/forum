const knex = require('knex');
const knexfile = require('../../knexfile');
const getUserIdByDb = require('../../helpers/getUserIdByDb');
const { getPosts, createPost, deletePost, createComment, deleteComment } = require('../../controllers/postsController')

class ReplyBuilder {
    constructor(statusCode = 200, payload = null) {
        this.statusCode = statusCode;
        this.payload = payload;
    }

    code(value) {
        if (value === undefined) {
            return this.statusCode;
        }
        this.statusCode = value;
        return this;
    };

    send(value) {
        this.payload = value;
        return this;
    }
};

const app = {};

beforeEach(async () => {
    const db = knex(knexfile['test']);
    await db.migrate.latest();
    await db.seed.run();
    const getUserId = getUserIdByDb(db);
    app.db = db;
    app.getUserId = getUserId;
});

describe('postsController', () => {
    describe('getPosts', () => {

        it('good case: known user', async () => {
            const usersBefore = await app.db('users');
            const postsBefore = await app.db('posts');
            const commentsBefore = await app.db('comments');

            const request = { query: { username: 'Diana' } };
            const reply = new ReplyBuilder();
            await getPosts.call(app, request, reply);

            const { statusCode, payload: posts } = reply;
            expect(statusCode).toBe(200);
            expect(posts.length).toBe(3); // posts
            expect(posts[0].comments.length).toBe(3); // 1 post comments
            expect(posts[1].comments.length).toBe(2); // 2 post comments
            expect(posts[2].comments.length).toBe(1); // 3 post comments

            const usersAfter = await app.db('users');
            const postsAfter = await app.db('posts');
            const commentsAfter = await app.db('comments');
            expect(usersAfter.length).toBe(usersBefore.length);
            expect(postsAfter.length).toBe(postsBefore.length);
            expect(commentsAfter.length).toBe(commentsBefore.length);
        });

        it('good case: unknown user', async () => {
            const usersBefore = await app.db('users');
            const postsBefore = await app.db('posts');
            const commentsBefore = await app.db('comments');

            const request = { query: { username: 'Helen' } };
            const reply = new ReplyBuilder();
            await getPosts.call(app, request, reply);

            const { statusCode, payload: posts } = reply;
            expect(statusCode).toBe(200);
            expect(posts.length).toBe(3); // posts
            expect(posts[0].comments.length).toBe(3); // 1 post comments
            expect(posts[1].comments.length).toBe(2); // 2 post comments
            expect(posts[2].comments.length).toBe(1); // 3 post comments

            const usersAfter = await app.db('users');
            const postsAfter = await app.db('posts');
            const commentsAfter = await app.db('comments');
            expect(usersAfter.length).toBe(usersBefore.length + 1);
            expect(postsAfter.length).toBe(postsBefore.length);
            expect(commentsAfter.length).toBe(commentsBefore.length);
        });

        it('bad case: empty name', async () => {
            const request = { query: { username: '' } };
            const reply = new ReplyBuilder();
            await getPosts.call(app, request, reply);

            const { statusCode, payload } = reply;
            expect(statusCode).toBe(400);
            expect(payload.error).toBe('Invalid query');
            expect(payload.detail.message).toBe('username is required');
        });

        it('bad case: long name', async () => {
            const request = { query: { username: 'EsmeraldaEsmeraldaEsmeraldaEsmeralda' } };
            const reply = new ReplyBuilder();
            await getPosts.call(app, request, reply);

            const { statusCode, payload } = reply;
            expect(statusCode).toBe(400);
            expect(payload.error).toBe('Invalid query');
            expect(payload.detail.message).toBe('username max length is 20');
        });

        it('bad case: server error', async () => {
            app.db = () => { throw new Error('test error') };
            const request = { query: { username: 'Carol' } };
            const reply = new ReplyBuilder();
            await getPosts.call(app, request, reply);

            const { statusCode, payload } = reply;
            expect(statusCode).toBe(500);
            expect(payload.error).toBe('server error');
            expect(payload.detail.message).toBe('test error');
        });

    });

    ///////////////////////////////////////////////////////////

    describe('createPost', () => {

        it('good case: known user', async () => {
            const usersBefore = await app.db('users');
            const postsBefore = await app.db('posts');
            const commentsBefore = await app.db('comments');

            const request = {
                body: {
                    username: 'Alice',
                    header: 'Test header',
                    text: 'Test text',
                }
            };
            const reply = new ReplyBuilder();
            await createPost.call(app, request, reply);

            const { statusCode, payload } = reply;
            const usersAfter = await app.db('users');
            const postsAfter = await app.db('posts');
            const commentsAfter = await app.db('comments');
            const [lastPost] = postsAfter.filter(({ id }) => id === Math.max(...postsAfter.map((post => post.id))));
            expect(statusCode).toBe(201);
            expect(payload).toMatchObject([{ id: postsAfter.length }]);
            expect(lastPost).toMatchObject({ id: 4, user_id: 1, header: 'Test header', text: 'Test text', });
            expect(usersAfter.length).toBe(usersBefore.length);
            expect(postsAfter.length).toBe(postsBefore.length + 1);
            expect(commentsAfter.length).toBe(commentsBefore.length);
        });

        it('good case: unknown user', async () => {
            const usersBefore = await app.db('users');
            const postsBefore = await app.db('posts');
            const commentsBefore = await app.db('comments');

            const request = {
                body: {
                    username: 'Zendaya',
                    header: 'Zendaya header',
                    text: 'Zendaya text',
                }
            };
            const reply = new ReplyBuilder();
            await createPost.call(app, request, reply);

            const { statusCode, payload } = reply;
            const usersAfter = await app.db('users');
            const postsAfter = await app.db('posts');
            const commentsAfter = await app.db('comments');
            const [lastPost] = postsAfter.filter(({ id }) => id === Math.max(...postsAfter.map((post => post.id))));
            expect(statusCode).toBe(201);
            expect(payload).toMatchObject([{ id: postsAfter.length }]);
            expect(lastPost).toMatchObject({ id: 4, user_id: 5, header: 'Zendaya header', text: 'Zendaya text', });
            expect(usersAfter.length).toBe(usersBefore.length + 1);
            expect(postsAfter.length).toBe(postsBefore.length + 1);
            expect(commentsAfter.length).toBe(commentsBefore.length);
        });

        it('bad case: empty username', async () => {
            const usersBefore = await app.db('users');
            const postsBefore = await app.db('posts');
            const commentsBefore = await app.db('comments');

            const request = {
                body: {
                    header: 'Header without username',
                    text: 'Text without username',
                }
            };
            const reply = new ReplyBuilder();
            await createPost.call(app, request, reply);

            const { statusCode, payload } = reply;
            expect(statusCode).toBe(400);
            expect(payload.error).toBe('Invalid query');
            expect(payload.detail.message).toBe('username is required');
            const usersAfter = await app.db('users');
            const postsAfter = await app.db('posts');
            const commentsAfter = await app.db('comments');
            expect(usersAfter.length).toBe(usersBefore.length);
            expect(postsAfter.length).toBe(postsBefore.length);
            expect(commentsAfter.length).toBe(commentsBefore.length);
        });

        it('bad case: long name', async () => {
            const usersBefore = await app.db('users');
            const postsBefore = await app.db('posts');
            const commentsBefore = await app.db('comments');

            const request = {
                body: {
                    username: 'a'.repeat(100),
                    header: 'Header of my post',
                    text: 'Very interesting text',
                }
            };
            const reply = new ReplyBuilder();
            await createPost.call(app, request, reply);

            const { statusCode, payload } = reply;
            expect(statusCode).toBe(400);
            expect(payload.error).toBe('Invalid query');
            expect(payload.detail.message).toBe('username max length is 20');
            const usersAfter = await app.db('users');
            const postsAfter = await app.db('posts');
            const commentsAfter = await app.db('comments');
            expect(usersAfter.length).toBe(usersBefore.length);
            expect(postsAfter.length).toBe(postsBefore.length);
            expect(commentsAfter.length).toBe(commentsBefore.length);
        });

        it('bad case: empty header', async () => {
            const usersBefore = await app.db('users');
            const postsBefore = await app.db('posts');
            const commentsBefore = await app.db('comments');

            const request = {
                body: {
                    username: 'Barbara',
                    header: '',
                    text: 'Some text',
                }
            };
            const reply = new ReplyBuilder();
            await createPost.call(app, request, reply);

            const { statusCode, payload } = reply;
            expect(statusCode).toBe(400);
            expect(payload.error).toBe('Invalid query');
            expect(payload.detail.message).toBe('header is required');
            const usersAfter = await app.db('users');
            const postsAfter = await app.db('posts');
            const commentsAfter = await app.db('comments');
            expect(usersAfter.length).toBe(usersBefore.length);
            expect(postsAfter.length).toBe(postsBefore.length);
            expect(commentsAfter.length).toBe(commentsBefore.length);
        });

        it('bad case: long header', async () => {
            const usersBefore = await app.db('users');
            const postsBefore = await app.db('posts');
            const commentsBefore = await app.db('comments');

            const request = {
                body: {
                    username: 'Alice',
                    header: 'Header'.repeat(100),
                    text: 'Very interesting text',
                }
            };
            const reply = new ReplyBuilder();
            await createPost.call(app, request, reply);

            const { statusCode, payload } = reply;
            expect(statusCode).toBe(400);
            expect(payload.error).toBe('Invalid query');
            expect(payload.detail.message).toBe('header max length is 100');
            const usersAfter = await app.db('users');
            const postsAfter = await app.db('posts');
            const commentsAfter = await app.db('comments');
            expect(usersAfter.length).toBe(usersBefore.length);
            expect(postsAfter.length).toBe(postsBefore.length);
            expect(commentsAfter.length).toBe(commentsBefore.length);
        });

        it('bad case: empty text', async () => {
            const usersBefore = await app.db('users');
            const postsBefore = await app.db('posts');
            const commentsBefore = await app.db('comments');

            const request = {
                body: {
                    username: 'Barbara',
                    header: 'Some header',
                    text: '',
                }
            };
            const reply = new ReplyBuilder();
            await createPost.call(app, request, reply);

            const { statusCode, payload } = reply;
            expect(statusCode).toBe(400);
            expect(payload.error).toBe('Invalid query');
            expect(payload.detail.message).toBe('text is required');
            const usersAfter = await app.db('users');
            const postsAfter = await app.db('posts');
            const commentsAfter = await app.db('comments');
            expect(usersAfter.length).toBe(usersBefore.length);
            expect(postsAfter.length).toBe(postsBefore.length);
            expect(commentsAfter.length).toBe(commentsBefore.length);
        });

        it('bad case: long header', async () => {
            const usersBefore = await app.db('users');
            const postsBefore = await app.db('posts');
            const commentsBefore = await app.db('comments');

            const request = {
                body: {
                    username: 'Alice',
                    header: 'Header of the post',
                    text: 'Very interesting text.'.repeat(20),
                }
            };
            const reply = new ReplyBuilder();
            await createPost.call(app, request, reply);

            const { statusCode, payload } = reply;
            expect(statusCode).toBe(400);
            expect(payload.error).toBe('Invalid query');
            expect(payload.detail.message).toBe('text max length is 255');
            const usersAfter = await app.db('users');
            const postsAfter = await app.db('posts');
            const commentsAfter = await app.db('comments');
            expect(usersAfter.length).toBe(usersBefore.length);
            expect(postsAfter.length).toBe(postsBefore.length);
            expect(commentsAfter.length).toBe(commentsBefore.length);
        });

        it('bad case: server error', async () => {
            app.db = () => { throw new Error('test error') };

            const request = {
                body: {
                    username: 'Alice',
                    header: 'Header of the post',
                    text: 'Text of the post',
                }
            };
            const reply = new ReplyBuilder();
            await createPost.call(app, request, reply);

            const { statusCode, payload } = reply;
            expect(statusCode).toBe(500);
            expect(payload.error).toBe('server error');
            expect(payload.detail.message).toBe('test error');
        });

    });
});
