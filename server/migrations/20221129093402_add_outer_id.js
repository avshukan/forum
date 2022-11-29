/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
const up = (knex) => knex.schema.table('users', (table) => {
    table.integer('outer_id');
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
