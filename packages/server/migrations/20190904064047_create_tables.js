/* eslint-disable func-names */
const { addTimestampColumns, dropTable, schema } = require('./utils')

exports.up = async function (knex) {
  await knex.raw('create extension if not exists "uuid-ossp"')

  await schema(knex).createTable('user', table => {
    table.uuid('id').notNullable().primary().defaultTo(knex.raw('uuid_generate_v4()'))
    table.string('email').notNullable().unique()
    table.boolean('email_confirmed').notNullable().defaultTo(false)
    table.string('username').notNullable().unique()
    table.boolean('is_admin').notNullable().defaultTo(false)
    addTimestampColumns(knex, table)
  })

  // create admin users
  await knex.table('user').insert([
    {
      email: 'ram@hiddentao.com',
      username: 'hiddentao',
      email_confirmed: true,
      is_admin: true,
    },
  ])

  await schema(knex).createTable('package', table => {
    table.uuid('id').notNullable().primary().defaultTo(knex.raw('uuid_generate_v4()'))
    table.uuid('owner_id').notNullable()
    table.string('name').notNullable().unique()
    addTimestampColumns(knex, table)
    table.foreign('owner_id').references('user.id').onUpdate('RESTRICT').onDelete('RESTRICT')
  })

  await schema(knex).createTable('version', table => {
    table.uuid('id').notNullable().primary().defaultTo(knex.raw('uuid_generate_v4()'))
    table.uuid('pkg_id').notNullable()
    table.text('title').notNullable()
    table.text('description').notNullable()
    table.text('search').notNullable()
    table.json('data').notNullable()
    addTimestampColumns(knex, table)
    table.foreign('pkg_id').references('package.id').onUpdate('RESTRICT').onDelete('CASCADE')
  })

  await schema(knex).createTable('bytecode_hash', table => {
    table.uuid('id').notNullable().primary().defaultTo(knex.raw('uuid_generate_v4()'))
    table.string('hash').notNullable()
    table.uuid('version_id').notNullable()
    addTimestampColumns(knex, table)
    table.unique([ 'hash', 'version_id' ])
    table.foreign('version_id').references('version.id').onUpdate('RESTRICT').onDelete('CASCADE')
  })
}

exports.down = async function (knex) {
  await dropTable(knex, 'bytecode_hash')
  await dropTable(knex, 'version')
  await dropTable(knex, 'package')
  await dropTable(knex, 'user')

  await knex.raw('drop extension if exists "uuid-ossp"')
}
