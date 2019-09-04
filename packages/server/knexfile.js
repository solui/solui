const buildConfig = ({ connection, ...props }) => ({
  client: 'pg',
  connection: {
    host: 'localhost',
    user: 'postgres',
    password: 'postgres',
    port: 5432,
    ...connection,
  },
  migrations: {
    tableName: 'knex_migrations'
  },
  searchPath: [ 'public' ],
  acquireConnectionTimeout: 10000,
  ...props,
})

module.exports = {
  development: buildConfig({
    connection: {
      database: 'solui-local',
    },
    seeds: {
      directory: './migrations/seeds'
    }
  }),
  test: buildConfig({
    connection: {
      database: 'solui-test',
    }
  }),
  live: buildConfig({
    connection: {
      database: 'solui-live',
      host: process.env.DB_HOST,
      user: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      port: process.env.DB_PORT,
      ssl: true,
    }
  }),
}
