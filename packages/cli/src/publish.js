import { PublishMutation, resolveError, stringifyError } from '@solui/graphql'
import { _, hash, uploadDataToIpfs } from '@solui/utils'
import { getUsedContracts, assertSpecValid } from '@solui/processor'

import { getApiClient } from './client'
import { logInfo, logTrace, logWarn } from './utils'

export const publish = async ({ spec, artifacts, customIpfs }) => {
  // check spec is valid
  await assertSpecValid({ spec, artifacts })

  logTrace(`Preparing artifacts ...`)

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

  if (customIpfs) {
    logTrace(`Publishing spec ${spec.id} to custom IPFS: ${customIpfs} ...`)

    const [ { hash: cid } ] = await uploadDataToIpfs(
      JSON.stringify({ spec, artifacts: artifactsToPublish }),
      customIpfs
    )

    logTrace('Published successfully!')

    logInfo(`CID:`, cid)
    logInfo(`View:`, `https://gateway.temporal.cloud/ipns/ui.solui.dev#l=<YOUR_IPFS_GATEWAY>/${cid}`)
  } else {
    logTrace(`Publishing spec ${spec.id} to solUI cloud ...`)

    const client = getApiClient()

    const ret = await client.safeMutate({
      mutation: PublishMutation,
      variables: {
        bundle: { spec, artifacts: artifactsToPublish }
      }
    })

    const { cid, url } = _.get(ret, 'data.result', {})

    logTrace('Published successfully!')

    logInfo(`CID:`, cid)
    logInfo(`View:`, url)
  }
}
