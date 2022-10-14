const knex = require('knex');
const knexfile = require('./knexfile');

const mode = process.env.NODE_ENV || 'development';
const configOptions = knexfile[mode];

module.exports = knex(configOptions);
