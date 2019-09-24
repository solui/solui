import { gql, createApolloClient } from '@solui/graphql'
import { _, stringifyGraphqlError } from '@solui/utils'

import { version } from '../package.json'
import config from './config'

const { SOLUI_API_ENDPOINT } = config

const PublishMutation = gql`
  mutation publishPackage ($bundle: PublishInput!) {
    publish(bundle: $bundle) {
      id
      error
    }
  }
`

export const publish = async ({ spec, artifacts, log = () => {} }) => {
  const client = createApolloClient(SOLUI_API_ENDPOINT, {
    name: '@solui/cli',
    version,
  })

  log(`Publishing spec ${spec.id} to public repository...`)

  let ret
  try {
    ret = await client.mutate({
      mutation: PublishMutation,
      variables: {
        bundle: { spec, artifacts }
      }
    })
  } catch (err) {
    throw new Error(stringifyGraphqlError(err))
  }

  const id = _.get(ret, 'data.publish.id')
  const error = _.get(ret, 'data.publish.error')

  if (error) {
    throw new Error(error)
  }

  log(`Successfully published: ${id}`)
}
