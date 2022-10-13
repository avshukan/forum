const boom = require('boom');

const getPosts = async (request, reply) => {
    try {
        const result = [
            {
                id: 1,
                author: 'Alice',
                header: 'First',
                text: 'bla-bla-bla',
                createdAt: new Date('2022-02-02')
            },
            {
                id: 2,
                author: 'Barbara',
                header: 'Second',
                text: 'O, my goddable!',
                createdAt: new Date('2022-03-03')
            }
        ];
        return result;
    } catch (error) {
        boom.boomify(error);
    }
};

const createPost = async (request, reply) => {
    try {
        const result = [
            {
                id: 3,
                author: 'Carol',
                header: 'Third',
                text: 'Wow',
                createdAt: new Date('2022-04-04')
            }
        ];
        return result;
    } catch (error) {
        boom.boomify(error);
    }
};

const deletePost = async (request, reply) => {
    try {
        return {};
    } catch (error) {
        boom.boomify(error);
    }
};

module.exports = { getPosts, createPost, deletePost };