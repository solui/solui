export const _buildPackageJoin = (qry, joinColumn, options = {}) => {
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

  return qry
}

export const _groupJoinRowsByPackage = rows => {
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
      versions: pkgs[id],
    }
  })

  return ret
}

export const searchByKeywords = async (keywords, page = 1) => {
  this._log.debug(`Search by keywords: ${keywords} ...`)

  let qry = this._db().table('version')
    .where('title LIKE "%?%" OR description LIKE "%?%"', [ keywords, keywords ])

  qry = this._buildPackageJoin(qry, 'version.pkg_id')

  qry = qry
    .limit(10)
    .offset((page - 1) * 10)

  const rows = await qry

  return Object.values(this._groupJoinRowsByPackage(rows))
}
