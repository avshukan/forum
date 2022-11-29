/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
const up = (knex) => knex.schema.table('users', (table) => {
  table.string('outer_id', 30);
});

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
const down = (knex) => knex.schema.table('users', (table) => {
  table.dropColumn('outer_id');
});

exports.up = up;
exports.down = down;
