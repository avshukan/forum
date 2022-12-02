/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
const up = (knex) => knex.schema.table('users', (table) => {
  table.string('picture_url', 255);
});

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
const down = (knex) => knex.schema.table('users', (table) => {
  table.dropColumn('picture_url');
});

exports.up = up;
exports.down = down;
