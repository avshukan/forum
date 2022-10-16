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
    appWrapper.closeDb = () => db.destroy();
});

afterEach(async () => {
    await appWrapper.closeDb();
})

describe('get all posts', () => {

    it('good case', async () => {
        const { app } = appWrapper;
        const response = await app.inject({
            url: '/api/v1/posts?username=Alice'
        })
        const posts = response.json();
        expect(posts.length).toBe(3); // posts
        expect(posts[0].comments.length).toBe(3); // 1 post comments
        expect(posts[1].comments.length).toBe(2); // 2 post comments
        expect(posts[2].comments.length).toBe(1); // 3 post comments
    });

    it('bad case: empty name', async () => {
        const { app } = appWrapper;
        const response = await app.inject({
            url: '/api/v1/posts'
        });
        const { statusCode } = response;
        const payload = response.json();
        expect(statusCode).toBe(400);
        expect(payload.error).toBe('Invalid query');
        expect(payload.detail.message).toBe('username is required');
    });

    it('bad case: long name', async () => {
        const { app } = appWrapper;
        const response = await app.inject({
            url: '/api/v1/posts?username=AliceAliceAliceAliceAliceAlice'
        })
        const { statusCode } = response;
        const payload = response.json();
        expect(statusCode).toBe(400);
        expect(payload.error).toBe('Invalid query');
        expect(payload.detail.message).toBe('username max length is 20');
    });
});