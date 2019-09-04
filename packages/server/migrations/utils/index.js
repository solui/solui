const schema = knex => knex.schema.withSchema('public')
exports.schema = schema

exports.addTimestampColumns = (knex, table) => {
  table.timestamps(false, true)
}

exports.dropTable = async (knex, name) => {
  const exists = await schema(knex).hasTable(name)

  if (exists) {
    await schema(knex).dropTable(name)
  }
}
