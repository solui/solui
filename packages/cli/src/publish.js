import { PublishMutation } from '@solui/graphql'
import { _, hash } from '@solui/utils'
import { getUsedContracts, assertSpecValid } from '@solui/processor'

import { getApiClient } from './client'
import { logInfo, logWarn } from './utils'

export const publish = async ({ spec, artifacts }) => {
  // check spec is valid
  await assertSpecValid({ spec, artifacts })

  logInfo(`Preparing artifacts ...`)

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

  // sanitize artifacts
  const artifactsToPublish = Object.keys(filteredArtifacts).reduce((m, k) => {
    const { contractName, abi, bytecode, deployedBytecode } = artifacts[k]

    if (!deployedBytecode) {
      logWarn(`No "deployedBytecode" key found for ${k} - search by on-chain contract address will not work!`)
    }

    m[k] = {
      contractName,
      abi,
      bytecode,
      ...(deployedBytecode ? {
        bytecodeHash: hash(deployedBytecode)
      } : null)
    }
    return m
  }, {})

  logInfo(`Publishing spec ${spec.id} to public repository ...`)

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
