const { build: buildApplication } = require('fastify-cli/helper')
const path = require('path')
const AppPath = path.join(__dirname, '..', '..', 'app.js')

describe('postsController', () => {
    it('get all posts', async () => {
        const argv = [AppPath]
        const app = await buildApplication(argv, { mode: 'test' })
        await app.ready();

        const response = await app.inject({
            url: '/api/v1/posts?username=Alice'
        })
        const posts = response.json();
        console.log('posts', posts)
        expect(posts.length).toBe(3); // posts
        expect(posts[0].comments.length).toBe(3); // first post comments
        expect(posts[1].comments.length).toBe(2); // first post comments
        expect(posts[2].comments.length).toBe(1); // first post comments
    });
});