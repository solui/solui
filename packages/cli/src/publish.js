import { PublishMutation } from '@solui/graphql'
import { _, getWeb3Instance, getBytecode } from '@solui/utils'
import { getUsedContracts, assertSpecValid } from '@solui/processor'
import { sha3 } from 'web3-utils'

import { getApiClient } from './client'
import { logTrace, logInfo } from './utils'

export const publish = async ({ spec, artifacts, testNetworkRpc, publishBytecodeHashes }) => {
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

  // publish bytecode hashes?
  if (publishBytecodeHashes) {
    logInfo(`Obtaining deployed bytecode hashes from network: ${testNetworkRpc} ...`)

    const web3 = await getWeb3Instance(testNetworkRpc)

    await Promise.all(Object.values(filteredArtifacts).map(async c => {
      const networkId = await web3.eth.net.getId()

      const { address } = _.get(c, `networks.${networkId}`, {})
      if (address) {
        const code = await getBytecode(web3, address)

        if (code) {
          c.bytecodeHash = sha3(code)

          logTrace(`Got bytecode hash for "${c.contractName}": ${c.bytecodeHash}`)
        }
      }
    }))
  }

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
