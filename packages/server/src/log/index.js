import bunyan from 'bunyan'
import bformat from 'bunyan-format'

const formattedOutput = bformat({
  outputMode: 'short',
  color: true,
  colorFromLevel: true
})

class Log {
  constructor (opts) {
    this._opts = opts
    this._name = opts.name
    this._log = bunyan(opts)

    ;[ 'trace', 'debug', 'info', 'warn', 'error' ].forEach(fn => {
      this[fn] = (...args) => {
        const obj = {}

        // an error object should get passed through specially
        obj.err = args.find(a => a.stack && a.message)

        this._log[fn].apply(this._log, [ obj, ...args ])
      }
    })
  }

  create (name) {
    return new Log({
      ...this._opts,
      name: `${this._name}/${name}`,
    })
  }
}

export default config => {
  const inTestMode = ('test' === config.APP_MODE)

  return new Log({
    name: 'root',
    streams: inTestMode ? [] : [
      {
        level: config.LOG,
        stream: formattedOutput,
      },
    ],
    serializers: {
      err: bunyan.stdSerializers.err
    },
    appMode: config.APP_MODE,
  })
}
