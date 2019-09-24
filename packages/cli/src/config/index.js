import envalid from 'envalid'

const { str } = envalid

const env = envalid.cleanEnv(
  process.env,
  {
    SERVER_GRAPHQL_ENDPOINT: str({ default: 'https://solui.dev/graphql' }),
  },
  {
    dotEnvPath: '.env'
  }
)

export default Object.freeze({
  ...env,
})
