import Koa from 'koa'
import koaSession from 'koa-session'
import cors from '@koa/cors'
import Router from 'koa-router'
import next from 'next'

import config from './config'
import createLog from './log'
import setupGraphQLEndpoint from './graphql'
import { createDb } from './db'
import { APP_STATE_KEYS } from '../common/appState'

const log = createLog(config)

process.on('uncaughtExceptions', e => {
  log.error('Uncaught exception', e)
})

process.on('unhandledRejection', (reason, p) => {
  log.error('Unhandled Rejection at:', p, 'reason:', reason)
})

const inDevMode = config.NODE_ENV !== 'production'

const init = async () => {
  const app = next({
    dev: inDevMode,
  })

  const handle = app.getRequestHandler()

  log.info(`App mode: ${config.APP_MODE}`)

  const server = new Koa()
  const router = new Router()
  const db = await createDb({ config, log })

  await app.prepare()

  // everything else goes to next.js app
  router.get('*', async ctx => {
    ctx.finalizeResVars()

    await handle(ctx.req, ctx.res)
    ctx.respond = false
  })

  // cors
  server.use(
    cors({
      origin: '*',
      credentials: true
    })
  )

  // for session cookies
  server.keys = [ config.SESSION_COOKIE_KEY ]
  server.use(koaSession({
    key: 'buidl',
    maxAge: 604800000, // 7 days
  }, server))

  server.use(async (ctx, nextHandler) => {
    ctx.res.statusCode = 200 // Koa doesn't seems to set the default statusCode.

    ctx.finalizeResVars = () => {
      APP_STATE_KEYS.forEach(k => {
        ctx.res[k] = ctx.session[k]
      })
    }

    await nextHandler()
  })

  // graphql
  setupGraphQLEndpoint({ config, server, db })

  server.use(router.routes())

  server.listen(config.PORT, err => {
    if (err) {
      throw err
    }

    log.info(`> Ready on http://localhost:${config.PORT}`)
  })
}

init().catch(err => {
  log.error(err)
  process.exit(-1)
})
