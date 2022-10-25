/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
const up = (knex) => knex.schema.createTable('users', (table) => {
  table.increments('id');
  table.string('username', 20).notNullable();
  table.timestamps(true, true);
});

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
const down = (knex) => knex.schema.dropTableIfExists('users');

exports.up = up;
exports.down = down;
