import { PublishMutation } from '@solui/graphql'
import { _ } from '@solui/utils'

import { getApiClient } from './client'
import { logTrace, logInfo } from './utils'

export const publish = async ({ spec, artifacts }) => {
  const client = getApiClient()

  logTrace(`Publishing spec ${spec.id} to public repository...`)

  const ret = await client.safeMutate({
    mutation: PublishMutation,
    variables: {
      bundle: { spec, artifacts }
    }
  })

  const versionId = _.get(ret, 'data.publish.versionId')
  const error = _.get(ret, 'data.publish.error')

  if (error) {
    throw new Error(error)
  }

  logInfo(`\nSuccessfully published: ${versionId}`)
}
