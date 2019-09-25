import open from 'open'
import uuid from 'uuid/v4'
import { createApolloClient, GetAuthTokenQuery, stringifyGraphqlError } from '@solui/graphql'
import { _ } from '@solui/utils'

import config, { saveUserConfig } from './config'
import { logInfo, logTrace } from './utils'
import { version } from '../package.json'

let client

const refreshAuthToken = async () => {
  const loginToken = uuid()

  const url = `${config.SOLUI_REPO_HOST}/login?token=${loginToken}`

  logInfo(`
You are not logged in!

Please login using the following URL: ${url}`)

  await open(url)

  await new Promise((resolve, reject) => {
    const __checkForAuthToken = async () => {
      try {
        const { data, errors } = await client.query({
          query: GetAuthTokenQuery,
          variables: { loginToken },
          fetchPolicy: 'network-only',
        })

        if (errors) {
          reject(new Error(stringifyGraphqlError(errors)))
          return
        }

        const { token } = _.get(data, 'authToken') || {}

        if (!token) {
          setTimeout(__checkForAuthToken, 5000)
          return
        }

        logTrace(`\nLogin successful!`)

        // got it, so save it!
        saveUserConfig({ SOLUI_TOKEN: token })

        resolve()
      } catch (err) {
        reject(err)
      }
    }

    __checkForAuthToken()
  })
}

export const getApiClient = () => {
  if (!client) {
    client = createApolloClient({
      serverHost: config.SOLUI_REPO_HOST,
      refreshAuthToken,
      name: '@solui/cli',
      version,
    })
  }

  if (config.SOLUI_TOKEN) {
    client.authToken.set(config.SOLUI_TOKEN)
  }

  return client
}
