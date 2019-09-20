import uuid from 'uuid/v4'
import { sha3 } from 'web3-utils'
import { _ } from '@solui/utils'
import { assertSpecValid } from '@solui/processor'

const SEARCH_RESULTS_PER_PAGE = 8

export function _extractVersionFromResultRow (row) {
  return {
    id: row.vId,
    title: row.vTitle,
    description: row.vDescription,
    created: row.vCreatedAt,
    ...(row.vData ? { data: row.vData } : null)
  }
}

export function _extractUserFromResultRow (row) {
  return {
    id: row.uId,
    username: row.uUsername,
  }
}

export function _extractPackageFromResultRow (row) {
  return {
    id: row.pId,
    name: row.pName,
    author: this._extractUserFromResultRow(row),
    created: row.pCreatedAt,
  }
}

export async function _searchPackages ({ filterCondition, filterValue, page }) {
  // count query
  const [ { count } ] = await this._db().raw(`
    select
      count(distinct(p.id))
    from package p
    inner join version v on v.pkg_id = p.id
    inner join (
      select pkg_id, MAX(created_at)
      from version
      group by pkg_id
    ) v2 on v2.pkg_id = p.id and v.created_at = v2.max
    ${filterCondition}
  `, filterValue)

  // data query
  const rows = await this._db().raw(`
    select
      p.id as p_id,
      p.name as p_name,
      p.created_at as p_created_at,
      u.id as u_id,
      u.username as u_username,
      v.id as v_id,
      v.title as v_title,
      v.description as v_description,
      v.created_at as v_created_at
    from "package" p
    inner join "user" u on u.id = p.owner_id
    inner join "version" v on v.pkg_id = p.id
    inner join (
      select pkg_id, MAX(created_at)
      from "version"
      group by pkg_id
    ) v2 on v2.pkg_id = p.id and v.created_at = v2.max
    ${filterCondition}
    limit ${SEARCH_RESULTS_PER_PAGE}
    offset ${((page - 1) * SEARCH_RESULTS_PER_PAGE)}
  `, filterValue)

  const packages = rows.map(row => ({
    ...this._extractPackageFromResultRow(row),
    latestVersion: this._extractVersionFromResultRow(row),
  }))

  return {
    packages,
    page,
    numPages: parseInt(Math.ceil(count / SEARCH_RESULTS_PER_PAGE), 10),
  }
}

export async function searchByKeywords (keyword, page = 1) {
  this._log.debug(`Search by keyword: "${keyword}" ...`)

  return this._searchPackages({
    filterCondition: `WHERE v.search LIKE ?`,
    filterValue: `%${keyword}%`,
    page,
  })
}

export async function searchByBytecodeHash (hash, page = 1) {
  this._log.debug(`Search by bytecode hash: "${hash}" ...`)

  return this._searchPackages({
    filterCondition: `
      INNER JOIN "bytecode_hash" h ON h.version_id = v.id
      WHERE h.hash = ?
    `,
    filterValue: hash,
    page,
  })
}

export async function getPackage (name, numVersions) {
  this._log.debug(`Get package: "${name}, ${numVersions} versions" ...`)

  // data query
  const rows = await this._db()
    .table('package')
    .select()
    .columns({
      p_id: 'package.id',
      p_name: 'package.name',
      p_created_at: 'package.created_at',
      u_id: 'user.id',
      u_username: 'user.username',
      v_id: 'version.id',
      v_title: 'version.title',
      v_description: 'version.description',
      v_created_at: 'version.created_at',
    })
    .innerJoin('user', 'package.owner_id', 'user.id')
    .innerJoin('version', 'version.pkg_id', 'package.id')
    .where('package.name', name)
    .orderBy('version.created_at', 'DESC')
    .limit(numVersions)

  if (!rows.length) {
    return null
  }

  const pkg = this._extractPackageFromResultRow(rows[0])

  pkg.versions = rows.map(row => this._extractVersionFromResultRow(row))

  return pkg
}

export async function getPackageVersion (id) {
  this._log.debug(`Get package version: "${id}" ...`)

  // data query
  const rows = await this._db().raw(`
    select
      v.id as v_id,
      v.title as v_title,
      v.description as v_description,
      v.created_at as v_created_at,
      v.data as v_data
    from "version" v
    where v.id = ?
    limit 1
  `, id)

  if (!rows.length) {
    return null
  }

  return this._extractVersionFromResultRow(rows[0])
}

export async function publishPackageVersion (spec, artifacts) {
  try {
    await assertSpecValid({ spec, artifacts })
  } catch (err) {
    let errStr = err.message

    if (err.details) {
      errStr += `:\n${err.details.join(`\n`)}`
    }

    throw new Error(errStr)
  }

  const { id: name } = spec

  return this._dbTrans(async trx => {
    const [ pkg ] = await this._db()
      .table('package')
      .select('id')
      .where('name', name)
      .limit(1)
      .transacting(trx)

    // TODO: check package owner

    let pkgId = _.get(pkg, 'id')

    // need to add a new package itself?
    if (!pkgId) {
      const [ { id: userId } ] = await this._db()
        .table('user')
        .select('id')
        .where('username', 'hiddentao')
        .limit(1)
        .transacting(trx)

      ;[ { id: pkgId } ] = await this._db()
        .table('package')
        .insert({
          id: uuid(),
          ownerId: userId,
          name,
        })
        .returning('id')
        .transacting(trx)
    }

    const [ { id: versionId } ] = await this._db()
      .table('version')
      .insert({
        id: uuid(),
        pkgId,
        title: spec.title,
        description: spec.description,
        data: {
          spec,
          // ensure we only insert what's necessary when it comes to artifact data
          artifacts: Object.entries(artifacts).reduce((m, [ k, v ]) => {
            m[k] = {
              abi: v.abi,
              bytecode: v.bytecode,
            }

            return m
          })
        },
      })
      .returning('id')
      .transacting(trx)

    const hashRows = Object.values(artifacts).map(({ bytecode }) => ({
      id: uuid(),
      versionId,
      hash: sha3(bytecode),
    }))

    await this._db()
      .batchInsert('bytecode_hash', hashRows)
      .transacting(trx)

    return versionId
  })
}
