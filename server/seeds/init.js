/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex('posts').del();
  await knex('comments').del();
  // Inserts new entries
  await knex('posts').insert([
    { id: 1, author: 'Alice', header: 'I\'m the First!', text: 'We are the champions' },
    { id: 2, author: 'Barbara', header: 'I lost my chance', text: 'Very very very sad post...' },
    { id: 3, author: 'Carol', header: 'Only third', text: 'At last but not least' },
  ]);
  await knex('comments').insert([
    { id: 1, post_id: 1, author: 'Barbara', text: 'I will win you next time' },
    { id: 2, post_id: 1, author: 'Carol', text: 'No! Me!' },
    { id: 3, post_id: 1, author: 'Alice', text: 'You both have no chances! Hah!' },
    { id: 4, post_id: 2, author: 'Diana', text: 'Never give up!' },
    { id: 5, post_id: 2, author: 'Barbara', text: 'Thank you, my dear friend (-:' },
    { id: 6, post_id: 3, author: 'Diana', text: 'Never give up too!' },
  ]);
};
