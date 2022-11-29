/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
const up = (knex) => knex.schema.table('users', (table) => {
    table.string('usertype', 20).notNullable().defaultTo('local');
});

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
const down = (knex) => knex.schema.table('users', (table) => {
    table.dropColumn('usertype');
});

exports.up = up;
exports.down = down;
