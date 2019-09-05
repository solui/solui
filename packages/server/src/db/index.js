import glob from 'glob'
import path from 'path'
import { addDays } from 'date-fns'
import _ from 'lodash'
import knex from 'knex'

// load in db methods
const METHODS = glob.sync(path.join(__dirname, '*.js')).reduce((m, file) => {
  if (file !== __filename) {
    // eslint-disable-next-line import/no-dynamic-require
    Object.entries(require(file)).forEach(([ n, f ]) => {
      if (m[n]) {
        throw new Error(`Method ${n} already declared!`)
      }
      m[n] = f
    })
  }
  return m
}, {})

export const tsStr = ({ add = 0 } = {}) => {
  let d = new Date()

  if (0 < add) {
    d = addDays(d, add)
  }

  return d.toISOString()
}

const mapKeyMapper = (_ignore, key) => _.camelCase(key)

class Db {
  constructor ({ config, log }) {
    this._knex = knex({
      ...config.DB,
      postProcessResponse: this._postProcessDbResponse.bind(this),
      wrapIdentifier: this._wrapDbIdentifier.bind(this)
    })
    this._log = log.create('db')

    Object.entries(METHODS).forEach(([ methodName, fn ]) => {
      this[methodName] = fn.bind(this)
    })
  }

  async initConnection () {
    await this._db().table('user').select()
    this._log.info('Db connected')
  }

  async shutdown () {
    await this._knex.destroy()
  }

  _db () {
    return this._knex
  }

  async _dbTransSerialized (cb) {
    return new Promise((resolve, reject) => {
      const __tryTransaction = async () => {
        try {
          this._log.debug('BEGIN TRANSACTION ...')

          const ret = await this._db().transaction(async trx => {
            await this._db()
              .raw('SET TRANSACTION ISOLATION LEVEL SERIALIZABLE')
              .transacting(trx)

            try {
              const result = await cb(trx)
              this._log.debug('... COMMIT :)')
              await trx.commit(result)
            } catch (err) {
              this._log.warn(err)
              this._log.debug('... ROLLBACK :/')
              await trx.rollback(err)
            }
          })

          resolve(ret)
        } catch (err) {
          // if it was due to transaction serialization error then retry the transaction
          // see https://www.postgresql.org/docs/9.5/transaction-iso.html
          if (err.toString().includes('could not serialize access')) {
            this._log.debug('... AUTO-RETRY TRANSACTION ....')
            __tryTransaction()
          } else {
            reject(err)
          }
        }
      }

      // kick things off
      __tryTransaction()
    })
  }

  async _dbTrans (cb) {
    this._log.debug('BEGIN TRANSACTION ...')

    return this._db().transaction(async trx => {
      try {
        const result = await cb(trx)
        this._log.debug('... COMMIT :)')
        await trx.commit(result)
      } catch (err) {
        this._log.warn(err)
        this._log.debug('... ROLLBACK :/')
        await trx.rollback(err)
      }
    })
  }

  _extractReturnedDbIds (rows) {
    return rows.map(r => Object.values(r).join(''))
  }

  _postProcessDbResponse (result) {
    if (Array.isArray(result) || Array.isArray(result.rows)) {
      return (result.rows || result).map(row => (
        _.mapValues(_.mapKeys(row, mapKeyMapper), o => (
          (o instanceof Date) ? o.toISOString() : o
        ))
      ))
    }

    return result
  }

  _wrapDbIdentifier (value, origImpl) {
    return origImpl('*' === value ? '*' : _.snakeCase(value))
  }
}

export const createDb = async ({ config, log }) => {
  const db = new Db({ config, log })
  await db.initConnection()
  return db
}
