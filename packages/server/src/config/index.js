import envalid, { str, num } from 'envalid'

const env = envalid.cleanEnv(process.env, {
  PORT: num({ default: 3002 }),
  NODE_ENV: str({ devDefault: 'development' }),
  APP_MODE: str({ choices: [ 'live', 'development' ], devDefault: 'development' }),
  LOG: str({ choices: [ 'error', 'warn', 'info', 'debug' ], default: 'debug' }),
  SESSION_COOKIE_KEY: str({ default: 'dbf74bb3482b6a2a5836f2ac7fd0ae9c' }),
  MAILGUN_DOMAIN: str({ default: 'solui.dev' }),
  ENCRYPTION_IV: str({ devDefault: '7641234e1acdf262' }),
  ENCRYPTION_KEY: str({ devDefault: '5959ff4902129c674ec40c8028636c92' }),
  MAILGUN_API_KEY: str(),
}, {
  dotEnvPath: '.env'
})

// eslint-disable-next-line import/no-dynamic-require
const modeConfig = require(`./${env.APP_MODE}`).default

export default Object.freeze({
  ...modeConfig,
  ...env,
  DB: require('../../knexfile')[env.APP_MODE]
})
