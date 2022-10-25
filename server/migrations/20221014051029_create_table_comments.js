/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
const up = (knex) => knex.schema.createTable('comments', (table) => {
  table.increments('id');
  table.integer('post_id').notNullable();
  table.integer('user_id').notNullable();
  table.string('text', 255).notNullable();
  table.timestamps(true, true);
});

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
const down = (knex) => knex.schema.dropTableIfExists('comments');

exports.up = up;
exports.down = down;
