/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex('comments').del();
  await knex('posts').del();
  await knex('users').del();
  // Inserts new entries
  const userIds = await knex('users')
    .returning('id')
    .insert([
      { username: 'Alice' },
      { username: 'Barbara' },
      { username: 'Carol' },
      { username: 'Diana' },
    ]);
  const postIds = await knex('posts')
    .returning('id')
    .insert([
      { user_id: userIds[0].id, header: 'I\'m the First!', text: 'We are the champions' },
      { user_id: userIds[1].id, header: 'I lost my chance', text: 'Very very very sad post...' },
      { user_id: userIds[2].id, header: 'Only third', text: 'At last but not least' },
    ]);
  await knex('comments').insert([
    { post_id: postIds[0].id, user_id: userIds[1].id, text: 'I will win you next time' },
    { post_id: postIds[0].id, user_id: userIds[2].id, text: 'No! Me!' },
    { post_id: postIds[0].id, user_id: userIds[0].id, text: 'You both have no chances! Hah!' },
    { post_id: postIds[1].id, user_id: userIds[3].id, text: 'Never give up!' },
    { post_id: postIds[1].id, user_id: userIds[1].id, text: 'Thank you, my dear friend (-:' },
    { post_id: postIds[2].id, user_id: userIds[3].id, text: 'Never give up too!' },
  ]);
};
