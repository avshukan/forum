const yup = require('yup');

async function getPosts(request, reply) {
    const schema = yup.string()
        .required('username is required')
        .max(20, 'username max length is 20');
    const { username } = request.query;
    if (!schema.isValidSync(username)) {
        const error = await schema.validate(username).catch((error) => error);
        const { message } = error;
        reply
            .code(400)
            .send({
                "error": "Invalid query",
                "detail": { message }
            });
        return;
    }
    try {
        const userId = await this.getUserId(username);
        const posts = await this.db('posts');
        const comments = await this.db('comments');
        const result = posts.map((post) => ({
            ...post,
            comments: comments
                .filter(({ post_id }) => post.id === post_id)
                .filter(({ status }) => (status === 'actual' || post.user_id === userId))
        }));
        reply.send(result);
        return;
    } catch (error) {
        reply
            .code(500)
            .send({
                "error": "server error",
                "detail": error
            });
    }
};

async function createPost(request, _reply) {
    const { username, ...data } = request.body;
    const userId = await this.getUserId(username);
    const id = this.db('posts')
        .returning('id')
        .insert({ ...data, user_id: userId });
    return id;
};

async function deletePost(request, _reply) {
    const { username } = request.body;
    const userId = await this.getUserId(username);
    const postId = request.params.postId;
    const deletedPost = await this.db('posts')
        .where({ id: postId, user_id: userId })
        .delete();
    if (deletedPost) {
        await this.db('comments')
            .where({ post_id: postId })
            .delete();
    }
    return deletedPost;
};

async function createComment(request, _reply) {
    const { postId } = request.params;
    const { username, ...data } = request.body;
    const userId = await this.getUserId(username);
    const id = this.db('comments')
        .returning('id')
        .insert({ ...data, post_id: postId, user_id: userId });
    return id;
};

async function deleteComment(request, _reply) {
    const postId = request.params.postId;
    const { username } = request.body;
    const userId = await this.getUserId(username);
    const commentId = request.params.commentId;
    const deletedComment = await this.db('comments')
        .where({ 'id': commentId, 'post_id': postId, 'user_id': userId })
        .update({ status: 'deleted' });
    return deletedComment;
};

module.exports = { getPosts, createPost, deletePost, createComment, deleteComment };
