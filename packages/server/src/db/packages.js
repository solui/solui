import uuid from 'uuid/v4'
import { _ } from '@solui/utils'
import { assertSpecValid } from '@solui/processor'

import { calculateVersionHash } from '../utils/data'

const SEARCH_RESULTS_PER_PAGE = 5

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

export async function _searchPackages ({
  filterCondition,
  filterValue,
  versionFilterCondition,
  versionFilterValue,
  page
}) {
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
      select version.pkg_id, MAX(version.created_at)
      from "version"
      ${versionFilterCondition}
      group by version.pkg_id
    ) v2 on v2.pkg_id = p.id and v.created_at = v2.max
    ${filterCondition}
    limit ${SEARCH_RESULTS_PER_PAGE}
    offset ${((page - 1) * SEARCH_RESULTS_PER_PAGE)}
  `, [].concat(filterValue, versionFilterValue))

  const packages = rows.map(row => ({
    ...this._extractPackageFromResultRow(row),
    version: this._extractVersionFromResultRow(row),
  }))

  return {
    packages,
    page,
    totalResults: count,
    numPages: parseInt(Math.ceil(count / SEARCH_RESULTS_PER_PAGE), 10),
  }
}

export async function searchByKeywords ({ keyword, page = 1 }) {
  this._log.debug(`Search by keyword: "${keyword}" ...`)

  return this._searchPackages({
    filterCondition: `WHERE v.search LIKE ?`,
    filterValue: [ `%${keyword}%` ],
    versionFilterCondition: '',
    versionFilterValue: [],
    page,
  })
}

export async function searchByBytecodeHash ({ bytecodeHash, page = 1 }) {
  this._log.debug(`Search by bytecode hash: "${bytecodeHash}" ...`)

  return this._searchPackages({
    filterCondition: `
      INNER JOIN "bytecode_hash" h ON h.version_id = v.id
      WHERE h.hash = ?
    `,
    filterValue: [ bytecodeHash ],
    versionFilterCondition: `
      INNER JOIN "bytecode_hash" ON version_id = version.id
      WHERE hash = ?
    `,
    versionFilterValue: [ bytecodeHash ],
    page,
  })
}

export async function getPackage ({ name }) {
  this._log.debug(`Get package: "${name}" ...`)

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
    .joinRaw(`
      inner join
        (select pkg_id, MAX(created_at) from version group by pkg_id) v2
        on v2.pkg_id = package.id AND version.created_at = v2.max
    `)
    .where('package.name', name)
    .orderBy('version.created_at', 'DESC')
    .limit(1)

  if (!rows.length) {
    return null
  }

  return {
    ...this._extractPackageFromResultRow(rows[0]),
    latestVersion: this._extractVersionFromResultRow(rows[0]),
  }
}

export async function getPackageVersion ({ id }) {
  this._log.debug(`Get package version: "${id}" ...`)

  // data query
  const rows = await this._db()
    .table('version')
    .select()
    .columns({
      v_id: 'version.id',
      v_title: 'version.title',
      v_description: 'version.description',
      v_created_at: 'version.created_at',
      v_data: 'version.data',
    })
    .where('id', id)
    .limit(1)

  if (!rows.length) {
    return null
  }

  return this._extractVersionFromResultRow(rows[0])
}

export async function publishPackageVersion ({ spec, artifacts }) {
  try {
    await assertSpecValid({ spec, artifacts })
  } catch (err) {
    let errStr = err.message

    if (err.details) {
      errStr += `:\n${err.details.join(`\n`)}`
    }

    throw new Error(errStr)
  }

  return this._dbTrans(async trx => {
    const { id: name } = spec

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

      const rows = await this._db()
        .table('package')
        .insert({
          id: uuid(),
          ownerId: userId,
          name,
        })
        .returning('id')
        .transacting(trx)

      pkgId = _.get(this._extractReturnedDbIds(rows), '0')
    }

    // calculate hash of this version so that we can check to see if it has
    // already been published
    const versionHash = calculateVersionHash({ spec, artifacts })

    const alreadyPublished = await this._db()
      .table('version')
      .select('id')
      .where('pkg_id', pkgId)
      .andWhere('hash', versionHash)
      .limit(1)

    if (alreadyPublished.length) {
      throw new Error(`This version has aleady been published: ${alreadyPublished[0].id}`)
    }

    // insert version
    const versionRows = await this._db()
      .table('version')
      .insert({
        id: uuid(),
        pkgId,
        title: spec.title,
        description: spec.description,
        search: `${spec.id} ${spec.title}`.toLowerCase(),
        data: {
          spec,
          // ensure we only insert what's necessary when it comes to artifact data
          artifacts: Object.keys(artifacts).reduce((m, k) => {
            const { abi, bytecode } = artifacts[k]
            m[k] = { abi, bytecode }
            return m
          }, {})
        },
        hash: versionHash,
      })
      .returning('id')
      .transacting(trx)

    const versionId = _.get(this._extractReturnedDbIds(versionRows), '0')

    // insert bytecode hashes if present
    const hashRows = Object.values(artifacts).reduce((m, { bytecodeHash }) => {
      if (bytecodeHash) {
        m.push({
          id: uuid(),
          versionId,
          hash: bytecodeHash,
        })
      }
      return m
    }, [])

    if (hashRows.length) {
      await this._db()
        .batchInsert('bytecode_hash', hashRows)
        .transacting(trx)
    }

    return versionId
  })
}
