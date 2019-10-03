const { subDays, addDays } = require('date-fns')
const uuid = require('uuid/v4')
const faker = require('faker')
const { _ } = require('@solui/utils')

const Ownable = require('./Ownable.json')
const spec = require('./spec.json')
const { calculateVersionHash } = require('../../src/utils/data')

const NUM_AUTHORS = 2
const NUM_PACKAGES = 10
const NUM_VERSIONS_PER_PACKAGE = 10
const TOTAL_NUM_VERSIONS = NUM_VERSIONS_PER_PACKAGE * NUM_PACKAGES

const deleteTableData = (knex, tables) => (
  Promise.all(tables.map(table => (
    knex(table).del()
  )))
)

const buildSpec = pkgName => {
  const s = { ...spec }
  s.id = pkgName
  s.title = faker.random.words(2)
  s.description = faker.random.words(25)
  return s
}

const buildData = pkgName => ({
  spec: buildSpec(pkgName),
  artifacts: {
    Ownable: _.pick(Ownable, [ 'abi', 'bytecode' ])
  }
})

const tsStr = ({ add = 0, sub = 0 } = {}) => {
  let d = new Date()

  if (0 < sub) {
    d = subDays(d, sub)
  } else if (0 < add) {
    d = addDays(d, add)
  }

  return d.toISOString()
}

exports.seed = async knex => {
  await deleteTableData(knex, [
    'version',
    'package',
  ])
  // in user table delete everything except core admin user
  await knex('user').whereNot('is_admin', true).del()

  const users = []

  for (let i = 0; NUM_AUTHORS > i; i += 1) {
    users.push({
      id: uuid(),
      username: faker.internet.userName(),
      email: `tuser${i}@hiddentao.com`,
      email_confirmed: true
    })
  }

  await knex('user').insert(users)

  const packages = []
  let userIndex = 0

  for (let i = 0; NUM_PACKAGES > i; i += 1) {
    packages.push({
      id: uuid(),
      owner_id: users[userIndex].id,
      name: `fixture-${i}`
    })

    userIndex = (users.length > (userIndex + 1) ? userIndex + 1 : 0)
  }

  await knex('package').insert(packages)

  const versions = []
  let packageIndex = 0

  for (let i = 0; TOTAL_NUM_VERSIONS > i; i += 1) {
    const data = buildData(packages[packageIndex].name)
    const { title, description } = data.spec

    versions.push({
      id: uuid(),
      pkg_id: packages[packageIndex].id,
      created_at: tsStr({ add: i }),
      data,
      title,
      description,
      search: `${data.spec.id} ${title}`.toLowerCase(),
      hash: calculateVersionHash(data)
    })

    packageIndex = (packages.length > (packageIndex + 1) ? packageIndex + 1 : 0)
  }

  await knex('version').insert(versions)
}
