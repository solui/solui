const envalid = require('envalid')

const { str, bool } = envalid

const VARS = {
  APP_MODE: str({ choices: [ 'live', 'development' ], devDefault: 'development' }),
  LOG: str({ choices: [ 'error', 'warn', 'info', 'debug' ], default: 'debug' }),
  SESSION_COOKIE_KEY: str({ default: 'dbf74bb3482b6a2a5836f2ac7fd0ae9c' }),
  MAILGUN_DOMAIN: str({ default: 'solui.dev' }),
  MAIL_SIMULATED: bool({ default: false, devDefault: true }),
  ENCRYPTION_IV: str({ devDefault: '7641234e1acdf262' }),
  ENCRYPTION_KEY: str({ devDefault: '5959ff4902129c674ec40c8028636c92' }),
  MAILGUN_API_KEY: str(),
}

const allEnv = envalid.cleanEnv(process.env, VARS, { dotEnvPath: '.env' })

const env = Object.keys(VARS).reduce((m, k) => {
  m[k] = allEnv[k]
  return m
}, {})


// eslint-disable-next-line import/no-dynamic-require
const modeConfig = require(`./${env.APP_MODE}`)

module.exports = Object.freeze({
  ...modeConfig,
  ...env,
  DB: require('../knexfile')[env.APP_MODE]
})