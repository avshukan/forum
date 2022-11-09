/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
const up = (knex) => knex.schema.table('users', (table) => {
    table.string('email', 30).notNullable();
    table.string('salt', 60).notNullable();
    table.specificType('passhash', 'CHAR(60)').notNullable();
});

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
const down = (knex) => knex.schema.table('users', (table) => {
    table.dropColumn('email');
    table.dropColumn('salt');
    table.dropColumn('passhash');
});

exports.up = up;
exports.down = down;
