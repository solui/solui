import { PublishMutation, stringifyGraphqlError } from '@solui/graphql'
import { _ } from '@solui/utils'

import { getApiClient } from './client'
import { logTrace, logInfo } from './utils'

export const publish = async ({ spec, artifacts }) => {
  const client = getApiClient()

  logTrace(`Publishing spec ${spec.id} to public repository...`)

  let ret
  try {
    ret = await client.mutate({
      mutation: PublishMutation,
      variables: {
        bundle: { spec, artifacts }
      }
    })

    if (ret.error) {
      throw ret.error
    }
  } catch (err) {
    throw new Error(stringifyGraphqlError(err))
  }

  const versionId = _.get(ret, 'data.publish.versionId')
  const error = _.get(ret, 'data.publish.error')

  if (error) {
    throw new Error(error)
  }

  logInfo(`Successfully published: ${versionId}`)
}
