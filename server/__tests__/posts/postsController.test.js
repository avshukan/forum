const { build: buildApplication } = require('fastify-cli/helper')
const path = require('path')
const AppPath = path.join(__dirname, '..', '..', 'app.js')
const { getPosts, createPost, deletePost, createComment, deleteComment } = require('../../controllers/postsController')

describe('postsController', () => {
    it('getPosts', async () => {
        const data = {
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
                { id: 1, post_id: 1, user_id: 2, text: 'I will win you next time' },
                { id: 2, post_id: 1, user_id: 3, text: 'No! Me!' },
                { id: 3, post_id: 1, user_id: 1, text: 'You both have no chances! Hah!' },
                { id: 4, post_id: 2, user_id: 4, text: 'Never give up!' },
                { id: 5, post_id: 2, user_id: 2, text: 'Thank you, my dear friend (-:' },
                { id: 6, post_id: 3, user_id: 4, text: 'Never give up too!' },
            ],
        };
        const getUserId = (username) => {
            if (!data.users.includes(username)) {
                data.users.push(username);
            }
            const index = data.users.indexOf(username);
            return index;
        };
        const db = (table) => data[table];
        db.context = { client: { config: { client: '' } } };
        const app = { db, getUserId };
        const request = {
            query: 'sdf',
        };
        const posts = await getPosts.call(app, request);
        expect(posts.length).toBe(3); // posts
        expect(posts[0].comments.length).toBe(3); // first post comments
        expect(posts[1].comments.length).toBe(2); // first post comments
        expect(posts[2].comments.length).toBe(1); // first post comments
        console.log(data.users)
    });
});