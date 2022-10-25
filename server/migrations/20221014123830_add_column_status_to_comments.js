/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
const up = (knex) => knex.schema.table('comments', (table) => {
  table.string('status', 20).defaultTo('actual');
});

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
const down = (knex) => knex.schema.table('comments', (table) => {
  table.dropColumn('status');
});

exports.up = up;
exports.down = down;
