const yup = require('yup');

async function getPosts(request, reply) {
    const { username } = request.query;

    try {
        yup
            .object({
                username: yup.string()
                    .required('username is required')
                    .max(20, 'username max length is 20')
            })
            .validateSync({ username });
    } catch ({ message }) {

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

        reply
            .send(result);

        return;
    } catch (error) {

        reply
            .code(500)
            .send({
                "error": "server error",
                "detail": error
            });

        return;
    }
};

async function createPost(request, reply) {
    const { body } = request;

    try {
        yup
            .object({
                username: yup.string()
                    .required('username is required')
                    .max(20, 'username max length is 20'),
                header: yup.string()
                    .required('header is required')
                    .max(100, 'header max length is 100'),
                text: yup.string()
                    .required('text is required')
                    .max(255, 'text max length is 255'),
            })
            .validateSync(body);
    } catch ({ message }) {

        reply
            .code(400)
            .send({
                "error": "Invalid query",
                "detail": { message }
            });

        return;
    }

    try {
        const { username, ...data } = request.body;
        const userId = await this.getUserId(username);
        const id = await this.db('posts')
            .returning('id')
            .insert({ ...data, user_id: userId });

        reply
            .code(201)
            .send(id);

        return;
    } catch (error) {

        reply
            .code(500)
            .send({
                "error": "server error",
                "detail": error
            });

        return;
    }
};

async function deletePost(request, reply) {
    const { postId } = request.params;
    const { username } = request.body;

    try {
        schema = yup
            .object({
                postId: yup
                    .number('postId must be a `number` type')
                    .required('postId is required')
                    .integer('postId have to be integer')
                    .positive('postId have to be positive'),
                username: yup
                    .string()
                    .required('username is required')
                    .max(20, 'username max length is 20'),
            })
            .validateSync({ postId, username });
    } catch ({ message }) {

        reply
            .code(400)
            .send({
                error: 'Invalid query',
                detail: { message }
            });

        return;
    }

    try {
        const userId = await this.getUserId(username);
        const [post] = await this.db('posts').where({ id: postId });

        if (!!post && !!post.user_id && post.user_id !== userId) {
            reply
                .code(403)
                .send({
                    error: 'Forbidden',
                    detail: { message: 'Post was created by other user' }
                });

            return;
        }

        const deletedPost = await this.db('posts')
            .where({ id: postId, user_id: userId })
            .delete();
        if (deletedPost) {
            await this.db('comments')
                .where({ post_id: postId })
                .delete();
        }

        reply
            .code(204)
            .send();

        return;
    } catch (error) {

        reply
            .code(500)
            .send({
                "error": "server error",
                "detail": error
            });

        return;
    }
};

async function createComment(request, reply) {
    const { postId } = request.params;
    const { username, text } = request.body;

    try {
        schema = yup
            .object({
                postId: yup
                    .number('postId must be a `number` type')
                    .required('postId is required')
                    .integer('postId have to be integer')
                    .positive('postId have to be positive'),
                username: yup
                    .string()
                    .required('username is required')
                    .max(20, 'username max length is 20'),
                text: yup.string()
                    .required('text is required')
                    .max(255, 'text max length is 255'),
            })
            .validateSync({ postId, username, text });
    } catch ({ message }) {

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
        const [post] = await this.db('posts').where({ id: postId });

        if (!post) {
            reply
                .code(404)
                .send({
                    error: 'Not Found',
                    detail: { message: "PostId doesn't exist", args: { postId } }
                });

            return;
        }

        const id = await this.db('comments')
            .returning('id')
            .insert({ post_id: postId, user_id: userId, text });

        reply
            .code(201)
            .send(id);

        return id;
    } catch (error) {

        reply
            .code(500)
            .send({
                "error": "server error",
                "detail": error
            });

        return;
    }
};

async function deleteComment(request, reply) {
    const { postId, commentId } = request.params;
    const { username } = request.body;

    try {
        schema = yup
            .object({
                postId: yup
                    .number('postId must be a `number` type')
                    .required('postId is required')
                    .integer('postId have to be integer')
                    .positive('postId have to be positive'),
                commentId: yup
                    .number('commentId must be a `number` type')
                    .required('commentId is required')
                    .integer('commentId have to be integer')
                    .positive('commentId have to be positive'),
                username: yup
                    .string()
                    .required('username is required')
                    .max(20, 'username max length is 20')
            })
            .validateSync({ postId, commentId, username });
    } catch ({ message }) {

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
        const [post] = await this.db('posts').where({ id: postId });
        if (!post) {
            reply
                .code(404)
                .send({
                    error: 'Not Found',
                    detail: { message: "PostId doesn't exist", args: { postId } }
                });

            return;
        }

        const [comment] = await this.db('comments').where({ id: commentId, post_id: postId });

        if (!!comment && !!comment.user_id && comment.user_id !== userId) {
            reply
                .code(403)
                .send({
                    error: 'Forbidden',
                    detail: { message: 'Comment was created by other user' }
                });

            return;
        }

        const x = await this.db('comments')
            .where({ id: commentId, post_id: postId, user_id: userId })
            .update({ status: 'deleted' });

        reply
            .code(204)
            .send();

        return;
    } catch (error) {

        reply
            .code(500)
            .send({
                "error": "server error",
                "detail": error
            });

        return;
    }
};

module.exports = { getPosts, createPost, deletePost, createComment, deleteComment };
