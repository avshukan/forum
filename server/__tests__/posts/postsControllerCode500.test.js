const getUserIdByDb = require('../../helpers/getUserIdByDb');
const { ReplyBuilder } = require('../../helpers/ReplyBuilder');
const { getPosts, createPost, deletePost, createComment, deleteComment } = require('../../controllers/postsController');

const serverErrorCases = [
    {
        name: 'getPosts',
        controller: getPosts,
        request: { query: { username: 'Alice' } },
    },
    {
        name: 'createPost',
        controller: createPost,
        request: { body: { username: 'Alice', header: 'Header of the post', text: 'Text of the post' } },
    },
    {
        name: 'deletePost',
        controller: deletePost,
        request: { params: { postId: 1 }, body: { username: 'Alice' } },
    },
    {
        name: 'createComment',
        controller: createComment,
        request: { params: { postId: 1 }, body: { username: 'Alice', text: 'Text of the comment' } },
    },
    {
        name: 'deleteComment',
        controller: deleteComment,
        request: { params: { postId: 1, commentId: 1 }, body: { username: 'Alice' } },
    },
];

const serverErrorHandler = async ({ controller, request = {} }) => {
    const db = () => { throw new Error('test error') };
    const getUserId = getUserIdByDb(db);
    const app = { db, getUserId };

    const reply = new ReplyBuilder();
    await controller.call(app, request, reply);

    const { statusCode, payload } = reply;
    expect(statusCode).toBe(500);
    expect(payload.error).toBe('server error');
    expect(payload.detail.message).toBe('test error');
};

describe('bad cases with server error (500)', () => {
    test.each(serverErrorCases)('bad case: server error on $name', serverErrorHandler);
});
