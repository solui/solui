import jwtMiddleware from 'koa-jwt'
import jwt from 'jsonwebtoken'

import config from '../config'
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

export const setupAuthMiddleware = ({ server, db, log }) => {
  server.use(
    jwtMiddleware({
      secret: SECRET,
      algorithm: ALGORITHM,
      // don't reject a request just because auth failed!
      passthrough: true,
    })
  )

  server.use(async (ctx, next) => {
    // if we successfully decoded a JWT
    if (ctx.state.user) {
      const { authBlob } = ctx.state.user

      try {
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

        ctx.state.uid = userId
        ctx.state.isAdmin = !!user.isAdmin
      } catch (err) {
        log.debug(err.message)
      }
    } else {
      ctx.state = {}
    }

    await next()
  })
}
