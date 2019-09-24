import envalid from 'envalid'

const { str } = envalid

const env = envalid.cleanEnv(
  process.env,
  {
    SOLUI_API_ENDPOINT: str({ default: 'https://solui.dev/graphql' }),
  },
  {
    dotEnvPath: '.env'
  }
)

export default Object.freeze({
  ...env,
})
