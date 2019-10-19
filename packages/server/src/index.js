import config from '../config'
import createLog from './log'
import { createDb } from './db'
import { createNotifier } from './notifier'

export const doBootstrap = () => {
  const log = createLog(config)
  const db = createDb({ config, log })
  const notifier = createNotifier({ config, log, db })

  process.on('uncaughtExceptions', e => {
    log.error('Uncaught exception', e)
  })

  process.on('unhandledRejection', (reason, p) => {
    log.error('Unhandled Rejection at:', p, 'reason:', reason)
  })

  return { log, db, notifier, config }
}
