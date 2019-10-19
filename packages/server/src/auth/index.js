import jwt from 'jsonwebtoken'
import { _ } from '@solui/utils'

import config from '../../config'
import { encrypt, decrypt } from '../utils/crypto'

const SECRET = 'solui'
const ALGORITHM = 'HS256'

const CRYPTO_PARAMS = {
  key: config.ENCRYPTION_KEY,
  iv: config.ENCRYPTION_IV,
}

export const generateAuthToken = async ({ expires, userId }) => {
  const authBlob = await encrypt({ expires, userId }, CRYPTO_PARAMS)

  return jwt.sign({ authBlob }, SECRET, {
    algorithm: ALGORITHM
  })
}

const AUTH_PREFIX = 'Bearer '

export const middleware = ({ db, log }) => next => async (req, res) => {
  req.state = {}

  let decoded

  try {
    let authToken = _.get(req, 'headers.authorization')

    if (typeof authToken === 'string' && authToken.startsWith(AUTH_PREFIX)) {
      authToken = authToken.substr(AUTH_PREFIX.length)
    }

    decoded = jwt.verify(authToken, SECRET, {
      algorithm: ALGORITHM
    })
  } catch (err) {
    // not authenticated!
  }

  if (decoded) {
    try {
      const { authBlob } = decoded

      let expires
      let userId

      try {
        ({ expires, userId } = await decrypt(authBlob, CRYPTO_PARAMS))
      } catch (err) {
        throw new Error('Authentication token is corrupted!')
      }

      if (new Date(expires).getTime() < Date.now()) {
        throw new Error('Authentication token has expired!')
      }

      const user = await db.getUser({ id: userId })

      if (!user) {
        throw new Error('Authentication token is invalid!')
      }

      req.state.uid = userId
      req.state.isAdmin = !!user.isAdmin
    } catch (err) {
      log.debug(err.message)
    }
  }

  await next(req, res)
}
