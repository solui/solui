import Koa from 'koa'
import koaSession from 'koa-session'
import cors from '@koa/cors'
import Router from 'koa-router'
import next from 'next'

import config from './config'
import createLog from './log'
import setupGraphQLEndpoint from './graphql'
import { createDb } from './db'
import { createNotifier } from './notifier'
import { APP_STATE_KEYS } from '../common/appState'

const log = createLog(config)

process.on('uncaughtExceptions', e => {
  log.error('Uncaught exception', e)
})

process.on('unhandledRejection', (reason, p) => {
  log.error('Unhandled Rejection at:', p, 'reason:', reason)
})

const inDevMode = config.APP_MODE === 'development'

const init = async () => {
  const app = next({
    dev: inDevMode,
  })

  const handle = app.getRequestHandler()

  log.info(`App mode: ${config.APP_MODE}`)

  const server = new Koa()
  const router = new Router()
  const db = await createDb({ config, log })
  const notifier = createNotifier({ router, config, log, db })

  await app.prepare()

  // handle notifier verification links
  router.get('notify', '/n/:t', async ctx => {
    ctx.finalizeResVars()

    try {
      await notifier.handleLink(ctx)
    } catch (err) {
      log.warn(err)
      await app.render(ctx.req, ctx.res, '/error', { msg: err.message, stack: err.stack })
    }
  })

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
    key: 'solui',
    maxAge: 604800000, // 7 days
  }, server))

  server.use(async (ctx, nextHandler) => {
    ctx.res.statusCode = 200 // Koa doesn't seems to set the default statusCode.

    ctx.finalizeResVars = () => {
      APP_STATE_KEYS.forEach(k => {
        switch (k) {
          case 'baseUrl':
            ctx.res[k] = config.BASE_URL
            break
          default:
            ctx.res[k] = ctx.session[k]
        }
      })
    }

    await nextHandler()
  })

  // graphql
  setupGraphQLEndpoint({ config, server, db, notifier })

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
