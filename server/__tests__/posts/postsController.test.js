const _ = require('lodash');
const path = require('path');
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

const initData = {
    users: [
        { id: 1, username: 'Alice' },
        { id: 2, username: 'Barbara' },
        { id: 3, username: 'Carol' },
        { id: 4, username: 'Diana' },
    ],
    posts: [
        { id: 1, user_id: 1, header: 'I\'m the First!', text: 'We are the champions' },
        { id: 2, user_id: 2, header: 'I lost my chance', text: 'Very very very sad post...' },
        { id: 3, user_id: 3, header: 'Only third', text: 'At last but not least' },
    ],
    comments: [
        { id: 1, post_id: 1, user_id: 2, text: 'I will win you next time', status: 'actual' },
        { id: 2, post_id: 1, user_id: 3, text: 'No! Me!', status: 'actual' },
        { id: 3, post_id: 1, user_id: 1, text: 'You both have no chances! Hah!', status: 'actual' },
        { id: 4, post_id: 2, user_id: 4, text: 'Never give up!', status: 'actual' },
        { id: 5, post_id: 2, user_id: 2, text: 'Thank you, my dear friend (-:', status: 'actual' },
        { id: 6, post_id: 3, user_id: 4, text: 'Never give up too!', status: 'actual' },
    ],
};

const app = {};

beforeEach(async () => {
    const data = _.cloneDeep(initData);

    const getUserId = (username) => {
        if (!data.users.includes(username)) {
            data.users.push(username);
        }
        const index = data.users.indexOf(username);
        return index;
    };

    const db = (table) => data[table];
    app.db = db;
    app.getUserId = getUserId;
});

describe('postsController', () => {
    describe('getPosts', () => {

        it('good case', async () => {
            const request = { query: { username: 'Helen' } };
            const reply = new ReplyBuilder();
            await getPosts.call(app, request, reply);
            const { statusCode, payload: posts } = reply;
            expect(statusCode).toBe(200);
            expect(posts.length).toBe(3); // posts
            expect(posts[0].comments.length).toBe(3); // 1 post comments
            expect(posts[1].comments.length).toBe(2); // 2 post comments
            expect(posts[2].comments.length).toBe(1); // 3 post comments
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
});