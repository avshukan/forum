const { build: buildApplication } = require('fastify-cli/helper')
const path = require('path');
const knex = require('knex');
const knexfile = require('../../knexfile');

const appWrapper = {};

beforeEach(async () => {
    const db = knex(knexfile['test']);
    await db.migrate.latest();
    await db.seed.run();
    const AppPath = path.join(__dirname, '..', '..', 'app.js');
    const app = await buildApplication([AppPath], { mode: 'test', db });
    await app.ready();
    appWrapper.app = app;
    appWrapper.db = db;
});

afterEach(async () => {
    await appWrapper.db.destroy();
    await appWrapper.app.close();
})

describe('posts', () => {

    describe('getPosts', () => {

        it('good case: known user', async () => {
            const { app, db } = appWrapper;
            const usersBefore = await db('users');
            const postsBefore = await db('posts');
            const commentsBefore = await db('comments');

            const response = await app.inject({
                url: '/api/v1/posts?username=Alice'
            })
            const posts = response.json();

            expect(posts.length).toBe(3); // posts
            expect(posts[0].comments.length).toBe(3); // 1 post comments
            expect(posts[1].comments.length).toBe(2); // 2 post comments
            expect(posts[2].comments.length).toBe(1); // 3 post comments
            const usersAfter = await db('users');
            const postsAfter = await db('posts');
            const commentsAfter = await db('comments');
            expect(usersAfter.length).toBe(usersBefore.length);
            expect(postsAfter.length).toBe(postsBefore.length);
            expect(commentsAfter.length).toBe(commentsBefore.length);
        });

        it('good case: unknown user', async () => {
            const { app, db } = appWrapper;
            const usersBefore = await db('users');
            const postsBefore = await db('posts');
            const commentsBefore = await db('comments');

            const response = await app.inject({
                url: '/api/v1/posts?username=Zendaya'
            })
            const posts = response.json();

            expect(posts.length).toBe(3); // posts
            expect(posts[0].comments.length).toBe(3); // 1 post comments
            expect(posts[1].comments.length).toBe(2); // 2 post comments
            expect(posts[2].comments.length).toBe(1); // 3 post comments
            const usersAfter = await db('users');
            const postsAfter = await db('posts');
            const commentsAfter = await db('comments');
            expect(usersAfter.length).toBe(usersBefore.length + 1);
            expect(postsAfter.length).toBe(postsBefore.length);
            expect(commentsAfter.length).toBe(commentsBefore.length);
        });

        it('bad case: empty name', async () => {
            const { app, db } = appWrapper;
            const usersBefore = await db('users');
            const postsBefore = await db('posts');
            const commentsBefore = await db('comments');

            const response = await app.inject({
                url: '/api/v1/posts'
            });
            const { statusCode } = response;
            const payload = response.json();

            expect(statusCode).toBe(400);
            expect(payload.error).toBe('Invalid query');
            expect(payload.detail.message).toBe('username is required');
            const usersAfter = await db('users');
            const postsAfter = await db('posts');
            const commentsAfter = await db('comments');
            expect(usersAfter.length).toBe(usersBefore.length);
            expect(postsAfter.length).toBe(postsBefore.length);
            expect(commentsAfter.length).toBe(commentsBefore.length);
        });

        it('bad case: long name', async () => {
            const { app, db } = appWrapper;
            const usersBefore = await db('users');
            const postsBefore = await db('posts');
            const commentsBefore = await db('comments');

            const response = await app.inject({
                url: '/api/v1/posts?username=AliceAliceAliceAliceAliceAlice'
            });
            const { statusCode } = response;
            const payload = response.json();

            expect(statusCode).toBe(400);
            expect(payload.error).toBe('Invalid query');
            expect(payload.detail.message).toBe('username max length is 20');
            const usersAfter = await db('users');
            const postsAfter = await db('posts');
            const commentsAfter = await db('comments');
            expect(usersAfter.length).toBe(usersBefore.length);
            expect(postsAfter.length).toBe(postsBefore.length);
            expect(commentsAfter.length).toBe(commentsBefore.length);
        });
    });

    ///////////////////////////////////////////////////////////

    describe('createPost', () => {

        it('good case: known user', async () => {
            const { app, db } = appWrapper;
            const usersBefore = await db('users');
            const postsBefore = await db('posts');
            const commentsBefore = await db('comments');

            const response = await app.inject({
                url: '/api/v1/posts',
                method: 'POST',
                payload: {
                    username: 'Alice',
                    header: 'Test header',
                    text: 'Test text',
                },
            });
            const payload = response.json();

            expect(response.statusCode).toBe(201);
            expect(payload).toMatchObject([{ id: 4 }]);
            const usersAfter = await db('users');
            const postsAfter = await db('posts');
            const commentsAfter = await db('comments');
            expect(usersAfter.length).toBe(usersBefore.length);
            expect(postsAfter.length).toBe(postsBefore.length + 1);
            expect(commentsAfter.length).toBe(commentsBefore.length);
        });

        it('good case: unknown user', async () => {
            const { app, db } = appWrapper;
            const usersBefore = await db('users');
            const postsBefore = await db('posts');
            const commentsBefore = await db('comments');

            const response = await app.inject({
                url: '/api/v1/posts',
                method: 'POST',
                payload: {
                    username: 'Xena',
                    header: 'Test header',
                    text: 'Test text',
                },
            });
            const payload = response.json();

            expect(response.statusCode).toBe(201);
            expect(payload).toMatchObject([{ id: 4 }]);
            const usersAfter = await db('users');
            const postsAfter = await db('posts');
            const commentsAfter = await db('comments');
            expect(usersAfter.length).toBe(usersBefore.length + 1);
            expect(postsAfter.length).toBe(postsBefore.length + 1);
            expect(commentsAfter.length).toBe(commentsBefore.length);
        });

        it('bad case: empty username', async () => {
            const { app, db } = appWrapper;
            const usersBefore = await db('users');
            const postsBefore = await db('posts');
            const commentsBefore = await db('comments');

            const response = await app.inject({
                url: '/api/v1/posts',
                method: 'POST',
                payload: {
                    header: 'Test header',
                    text: 'Test text',
                },
            });
            const payload = response.json();

            expect(response.statusCode).toBe(400);
            expect(payload).toMatchObject({
                error: 'Invalid query',
                detail: { message: 'username is required' },
            });
            const usersAfter = await db('users');
            const postsAfter = await db('posts');
            const commentsAfter = await db('comments');
            expect(usersAfter.length).toBe(usersBefore.length);
            expect(postsAfter.length).toBe(postsBefore.length);
            expect(commentsAfter.length).toBe(commentsBefore.length);
        });

        it('bad case: long username', async () => {
            const { app, db } = appWrapper;
            const usersBefore = await db('users');
            const postsBefore = await db('posts');
            const commentsBefore = await db('comments');

            const response = await app.inject({
                url: '/api/v1/posts',
                method: 'POST',
                payload: {
                    username: 'Long username'.repeat(10),
                    header: 'Test header',
                    text: 'Test text',
                },
            });
            const payload = response.json();

            expect(response.statusCode).toBe(400);
            expect(payload).toMatchObject({
                error: 'Invalid query',
                detail: { message: 'username max length is 20' },
            });
            const usersAfter = await db('users');
            const postsAfter = await db('posts');
            const commentsAfter = await db('comments');
            expect(usersAfter.length).toBe(usersBefore.length);
            expect(postsAfter.length).toBe(postsBefore.length);
            expect(commentsAfter.length).toBe(commentsBefore.length);
        });

        it('bad case: empty header', async () => {
            const { app, db } = appWrapper;
            const usersBefore = await db('users');
            const postsBefore = await db('posts');
            const commentsBefore = await db('comments');

            const response = await app.inject({
                url: '/api/v1/posts',
                method: 'POST',
                payload: {
                    username: 'Carol',
                    header: '',
                    text: 'Test text',
                },
            });
            const payload = response.json();

            expect(response.statusCode).toBe(400);
            expect(payload).toMatchObject({
                error: 'Invalid query',
                detail: { message: 'header is required' },
            });
            const usersAfter = await db('users');
            const postsAfter = await db('posts');
            const commentsAfter = await db('comments');
            expect(usersAfter.length).toBe(usersBefore.length);
            expect(postsAfter.length).toBe(postsBefore.length);
            expect(commentsAfter.length).toBe(commentsBefore.length);
        });

        it('bad case: long header', async () => {
            const { app, db } = appWrapper;
            const usersBefore = await db('users');
            const postsBefore = await db('posts');
            const commentsBefore = await db('comments');

            const response = await app.inject({
                url: '/api/v1/posts',
                method: 'POST',
                payload: {
                    username: 'Carol',
                    header: 'Test header'.repeat(10),
                    text: 'Test text',
                },
            });
            const payload = response.json();

            expect(response.statusCode).toBe(400);
            expect(payload).toMatchObject({
                error: 'Invalid query',
                detail: { message: 'header max length is 100' },
            });
            const usersAfter = await db('users');
            const postsAfter = await db('posts');
            const commentsAfter = await db('comments');
            expect(usersAfter.length).toBe(usersBefore.length);
            expect(postsAfter.length).toBe(postsBefore.length);
            expect(commentsAfter.length).toBe(commentsBefore.length);
        });

        it('bad case: empty text', async () => {
            const { app, db } = appWrapper;
            const usersBefore = await db('users');
            const postsBefore = await db('posts');
            const commentsBefore = await db('comments');

            const response = await app.inject({
                url: '/api/v1/posts',
                method: 'POST',
                payload: {
                    username: 'Carol',
                    header: 'Test header',
                    text: '',
                },
            });
            const payload = response.json();

            expect(response.statusCode).toBe(400);
            expect(payload).toMatchObject({
                error: 'Invalid query',
                detail: { message: 'text is required' },
            });
            const usersAfter = await db('users');
            const postsAfter = await db('posts');
            const commentsAfter = await db('comments');
            expect(usersAfter.length).toBe(usersBefore.length);
            expect(postsAfter.length).toBe(postsBefore.length);
            expect(commentsAfter.length).toBe(commentsBefore.length);
        });

        it('bad case: long text', async () => {
            const { app, db } = appWrapper;
            const usersBefore = await db('users');
            const postsBefore = await db('posts');
            const commentsBefore = await db('comments');

            const response = await app.inject({
                url: '/api/v1/posts',
                method: 'POST',
                payload: {
                    username: 'Carol',
                    header: 'Test header',
                    text: 'Test text'.repeat(50),
                },
            });
            const payload = response.json();

            expect(response.statusCode).toBe(400);
            expect(payload).toMatchObject({
                error: 'Invalid query',
                detail: { message: 'text max length is 255' },
            });
            const usersAfter = await db('users');
            const postsAfter = await db('posts');
            const commentsAfter = await db('comments');
            expect(usersAfter.length).toBe(usersBefore.length);
            expect(postsAfter.length).toBe(postsBefore.length);
            expect(commentsAfter.length).toBe(commentsBefore.length);
        });

    });

});