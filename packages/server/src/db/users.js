import { _, obfuscate } from '@solui/utils'

import { generateAuthToken } from '../auth'

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
    this._log.debug(`Create user entry for: ${obfuscate(email)}`)

    ret = await this._db().table('user')
      .insert({ email, username: `${obfuscate(email)}-${Math.random() * 100000}` })
      .returning('id')
      .transacting(trx)

    id = _.get(this._extractReturnedDbIds(ret), '0')
  }

  return id
}

export async function getUser ({ id }) {
  this._log.debug(`Get user: "${id}" ...`)

  const rows = await this._db()
    .table('user')
    .select('*')
    .where('id', id)
    .limit(1)

  return _.get(rows, '0')
}

export async function saveLoginToken ({ email, loginToken }) {
  await this._dbTrans(async trx => {
    return this._db()
      .table('login_token')
      .insert({
        id: loginToken,
        userId: await this._createUserOrFetchExisting(email, trx),
      })
  })

  this._log.debug(`User successfully logged in: "${obfuscate(email)}" ...`)
}

export async function getAuthToken ({ loginToken }) {
  this._log.debug(`Get auth token for login: ${loginToken} ...`)

  return this._dbTrans(async trx => {
    const rows = await this._db()
      .table('login_token')
      .select('userId')
      .where('id', loginToken)
      .limit(1)
      .transacting(trx)

    const userId = _.get(rows, '0.userId')

    if (!userId) {
      return null
    }

    this._log.debug(`Generate auth token for login: ${loginToken}`)

    // now delete login_token
    await this._db()
      .table('login_token')
      .delete()
      .where('id', loginToken)
      .transacting(trx)

    const expires = new Date(Date.now() + /* 1 month */ 2592000000)

    // generate and return auth token
    return {
      token: await generateAuthToken({ expires, userId }),
      expires,
    }
  })
}
