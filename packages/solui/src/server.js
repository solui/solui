import Koa from 'koa'
import cors from '@koa/cors'
import Router from 'koa-router'
import next from 'next'

process.on('uncaughtExceptions', e => {
  console.error('Uncaught exception', e)
})

process.on('unhandledRejection', (reason, p) => {
  console.error('Unhandled Rejection at:', p, 'reason:', reason)
})

const init = async () => {
  const app = next({
    dev: process.env.NODE_ENV !== 'production',
  })

  await app.prepare()

  const appHandler = app.getRequestHandler()

  const router = new Router()

  router.get('*', async ctx => {
    await appHandler(ctx.req, ctx.res)
    ctx.respond = false
  })

  const server = new Koa()

  server.use(cors({ origin: '*', credentials: true }))

  const port = process.env.PORT || 3001

  server.use(router.routes())

  await new Promise((resolve, reject) => {
    server.listen(port, err => {
      if (err) {
        reject(err)
      } else {
        resolve()
      }
    })
  })

  console.log(`Serving on http://localhost:${port}`)
}

init().catch(err => {
  console.error(err)
  process.exit(-1)
})
