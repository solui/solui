import { getApiClient } from '../..'

export const getMeta = () => ({
  summary: 'Login to the public spec repository and obtain an authentication token.',
})

export const execute = async () => {
  const client = getApiClient()

  await client.authToken.refresh()
}
