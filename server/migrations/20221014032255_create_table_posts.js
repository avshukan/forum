/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
const up = (knex) => knex.schema.createTable('posts', (table) => {
  table.increments('id');
  table.integer('user_id').notNullable();
  table.string('header', 100).notNullable();
  table.string('text', 255).notNullable();
  table.timestamps(true, true);
});

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
const down = (knex) => knex.schema.dropTableIfExists('posts');

exports.up = up;
exports.down = down;
