const { genSaltSync, hashSync } = require('bcryptjs');

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
const seed = async (knex) => {
  // Deletes ALL existing entries
  await knex('comments').del();
  await knex('posts').del();
  await knex('users').del();
  // prepare password and salt
  const password = 'qweasd';
  const saltLength = 16;
  const salts = [
    genSaltSync(saltLength),
    genSaltSync(saltLength),
    genSaltSync(saltLength),
    genSaltSync(saltLength),
  ];

  // Inserts new entries
  const userIds = await knex('users')
    .returning('id')
    .insert([
      {
        username: 'Alice', email: 'alice@example.com', salt: salts[0], passhash: hashSync(password, salts[0]),
      },
      {
        username: 'Barbara', email: 'barbara@example.com', salt: salts[1], passhash: hashSync(password, salts[1]),
      },
      {
        username: 'Carol', email: 'carol@example.com', salt: salts[2], passhash: hashSync(password, salts[2]),
      },
      {
        username: 'Diana', email: 'diana@example.com', salt: salts[3], passhash: hashSync(password, salts[3]),
      },
    ]);
  const postIds = await knex('posts')
    .returning('id')
    .insert([
      { user_id: userIds[0].id, header: 'I\'m the First!', text: 'We are the champions' },
      { user_id: userIds[1].id, header: 'I lost my chance', text: 'Very very very sad post...' },
      { user_id: userIds[2].id, header: 'Only third', text: 'At last but not least' },
    ]);
  await knex('comments').insert([
    {
      post_id: postIds[0].id,
      user_id: userIds[1].id,
      text: 'I will win you next time',
      status: 'actual',
    },
    {
      post_id: postIds[0].id,
      user_id: userIds[2].id,
      text: 'No! Me!',
      status: 'actual',
    },
    {
      post_id: postIds[0].id,
      user_id: userIds[0].id,
      text: 'You both have no chances! Hah!',
      status: 'deleted',
    },
    {
      post_id: postIds[1].id,
      user_id: userIds[3].id,
      text: 'Never give up!',
      status: 'actual',
    },
    {
      post_id: postIds[1].id,
      user_id: userIds[1].id,
      text: 'Thank you, my dear friend (-:',
      status: 'actual',
    },
    {
      post_id: postIds[2].id,
      user_id: userIds[3].id,
      text: 'Never give up too!',
      status: 'actual',
    },
  ]);
};

exports.seed = seed;
