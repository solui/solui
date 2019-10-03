import { PublishMutation } from '@solui/graphql'
import { _ } from '@solui/utils'
import { getUsedContracts, assertSpecValid } from '@solui/processor'

import { getApiClient } from './client'
import { logInfo } from './utils'

export const publish = async ({ spec, artifacts }) => {
  // check spec is valid
  await assertSpecValid({ spec, artifacts })

  // find out which contracts to keep
  const contractsToPublish = getUsedContracts({ spec })

  if (!contractsToPublish.length) {
    throw new Error('No contracts are used within the UI spec :/')
  }

  // filter artifacts list
  const filteredArtifacts = Object.keys(artifacts).reduce((m, k) => {
    if (contractsToPublish.includes(k)) {
      m[k] = artifacts[k]
    }
    return m
  }, {})

  const client = getApiClient()

  logInfo(`Publishing spec ${spec.id} to public repository ...`)

  // sanitize artifacts
  const artifactsToPublish = Object.keys(filteredArtifacts).reduce((m, k) => {
    const { contractName, abi, bytecode, bytecodeHash } = artifacts[k]
    m[k] = { contractName, abi, bytecode, bytecodeHash }
    return m
  }, {})

  const ret = await client.safeMutate({
    mutation: PublishMutation,
    variables: {
      bundle: { spec, artifacts: artifactsToPublish }
    }
  })

  const versionId = _.get(ret, 'data.publish.versionId')
  const error = _.get(ret, 'data.publish.error')

  if (error) {
    throw new Error(error)
  }

  logInfo(`\nSuccessfully published: ${versionId}`)
}
