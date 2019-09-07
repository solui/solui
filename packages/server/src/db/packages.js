import _ from 'lodash'
import knex from 'knex'

export function _buildPackageJoin (qry, joinColumn, options = {}) {
  qry = qry.column({
    pId: 'package.id',
    pName: 'package.name',
    pOwnerId: 'package.owner_id',
    pCreated: 'package.created_at',
  })

  if (options.leftJoin) {
    qry = qry.leftJoin('package', joinColumn, 'package.id')
  } else {
    qry = qry.innerJoin('package', joinColumn, 'package.id')
  }

  qry = this._buildUserJoin(qry, 'package.owner_id')

  return qry
}

export function _groupJoinRowsByPackage (rows) {
  const pkgs = {}

  // group rows by pkg id
  rows.forEach(row => {
    if (row.pId) {
      pkgs[row.pId] = pkgs[row.pId] || []
      pkgs[row.pId].push(row)
    }
  })

  const ret = {}

  // for each pkg set its details and collate its versions
  Object.keys(pkgs).forEach(id => {
    ret[id] = {
      id,
      name: pkgs[id][0].pName,
      created: pkgs[id][0].pCreated,
      author: {
        id: pkgs[id][0].pOwnerId,
      },
      versions: pkgs[id].map(v => ({
        ..._.pick(v, 'id', 'title', 'description', 'data'),
        created: v.createdAt,
      }))
    }
  })

  return ret
}

const RESULTS_PER_PAGE = 10

export async function _searchPackages (countQry, fetchQry, page = 1) {
  // get total count
  const [ { pkgcount } ] = await countQry

  // get results
  const rows = await this._buildPackageJoin(fetchQry, 'version.pkg_id')
    .orderBy('version.created_at', 'desc')
    .limit(RESULTS_PER_PAGE)
    .offset((page - 1) * RESULTS_PER_PAGE)

  const packages = Object.values(this._groupJoinRowsByPackage(rows))

  return {
    packages,
    page,
    numPages: parseInt(Math.ceil(pkgcount / RESULTS_PER_PAGE), 10),
  }
}

export async function searchByKeywords (keywords, page) {
  this._log.debug(`Search by keywords: "${keywords}" ...`)

  const filterCondition = [ `search LIKE ?`, [ `%${keywords}%` ] ]

  // get total count
  const countQry = this._db().raw(
    `select count(distinct pkg_id) as pkgcount from version where ${filterCondition[0]}`, filterCondition[1]
  )

  // get results
  const fetchQry = this._db().table('version')
    .select('version.*')
    .whereRaw(`search LIKE ?`, [ `%${keywords}%` ])

  return this._searchPackages(countQry, fetchQry, page)
}

export async function searchByBytecodeHash (hash, page) {
  this._log.debug(`Search by bytecode hash: "${hash}" ...`)

  // get total count
  const countQry = this._db().raw(
    `select count(distinct pkg_id) as pkgcount from version
    inner join bytecode_hash on version.id = bytecode_hash.version_id
    where bytecode_hash.hash = ?`, hash
  )

  // get results
  const fetchQry = this._db().table('version')
    .select('version.*')
    .innerJoin('bytecode_hash', 'version.id', 'bytecode_hash.version_id')
    .where(`bytecode_hash.hash`, hash)

  return this._searchPackages(countQry, fetchQry, page)
}
