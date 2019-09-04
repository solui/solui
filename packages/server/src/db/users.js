import _ from 'lodash'

import { obfuscate } from '../utils/string'

export async function _createUserOrFetchExisting (email, trx) {
  email = email.toLowerCase()

  let ret = await this._db().table('user')
    .select()
    .where({ email })
    .limit(1)
    .transacting(trx)

  let id
  ;({ id } = _.get(ret, '0', {}))

  if (!id) {
    this._log.debug(`Create user: ${email}`)

    ret = await this._db().table('user')
      .insert({ email })
      .returning('id')
      .transacting(trx)

    id = _.get(this._extractReturnedDbIds(ret), '0')
  }

  return id
}

export async function getUserByEmail (email) {
  this._log.debug(`Get user for with email ${obfuscate(email)} ...`)

  const rows = await this._db().table('user')
    .where({ email })
    .limit(1)

  return rows[0]
}

export async function getUserById (id) {
  this._log.debug(`Get user with id ${id} ...`)

  const rows = await this._db().table('user')
    .where({ id })
    .limit(1)

  return rows[0]
}

export async function isUserAdmin (id) {
  this._log.debug(`Check if user ${id} is admin ...`)

  const rows = await this._db().table('user')
    .where({ id, isAdmin: true })
    .limit(1)

  return !!rows[0]
}
