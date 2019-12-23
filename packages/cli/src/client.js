import open from 'open'
import uuid from 'uuid/v4'
import { createApolloClient, GetAuthTokenQuery, ERROR_CODES } from '@solui/graphql'
import { _ } from '@solui/utils'

import config, { saveUserConfig } from './config'
import { logInfo, logTrace } from './utils'
import { version } from '../package.json'

let client

const refreshAuthToken = async () => {
  const loginToken = uuid()

  const url = `${config.SOLUI_REPO_HOST}/login?token=${loginToken}`

  logInfo(`
Please login using the following URL: ${url}`)

  await open(url)

  await new Promise((resolve, reject) => {
    const __checkForAuthToken = async () => {
      try {
        let data

        try {
          ({ data } = await client.safeQuery({
            query: GetAuthTokenQuery,
            variables: { loginToken },
            fetchPolicy: 'network-only',
          }))
        } catch (err) {
          if (err.code !== ERROR_CODES.NOT_FOUND) {
            reject(err)
            return
          }
        }

        const { token } = _.get(data, 'result', {})

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
      endpoint: `${config.SOLUI_REPO_HOST}/api/graphql`,
      authTokenImplementation: {
        get: () => config.SOLUI_TOKEN,
        refresh: refreshAuthToken,
      },
      name: '@solui/cli',
      version,
    })
  }

  return client
}
