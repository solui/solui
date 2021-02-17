import path from 'path'
import fs from 'fs'
import home from 'home'
import dotenv from 'dotenv'
import dotenvStringify from 'dotenv-stringify'
import envalid from 'envalid'

const HOME_CONFIG_FILE = path.join(home(), '.solui')

const loadUserConfig = () => {
  try {
    return dotenv.parse(fs.readFileSync(HOME_CONFIG_FILE))
  } catch (err) {
    return {}
  }
}

const loadLocalConfig = () => {
  try {
    return dotenv.parse(fs.readFileSync(path.join(process.cwd(), '.env')))
  } catch (err) {
    return {}
  }
}

export const saveUserConfig = config => {
  const cfg = {
    ...loadUserConfig(),
    ...config,
  }

  try {
    fs.writeFileSync(HOME_CONFIG_FILE, dotenvStringify(cfg))
    fs.chmodSync(HOME_CONFIG_FILE, 0o600) // only owner can access

    console.log(`\nUpdated user config file: ${HOME_CONFIG_FILE}`)
  } catch (err) {
    console.warn(`Error writing config file ${HOME_CONFIG_FILE}: ${err.message}`)
  }
}

const env = envalid.cleanEnv(
  {
    ...loadUserConfig(),
    ...loadLocalConfig(),
    ...process.env
  },
  {
    SOLUI_REPO_HOST: envalid.str({ default: 'https://solui.dev' }),
    SOLUI_TOKEN: envalid.str({ default: '' }),
    SOLUI_RENDERER_HOST: envalid.str({ default: 'https://gateway.pinata.cloud/ipns/ui.solui.dev' }),
  },
)

export default Object.freeze({
  ...env,
})
