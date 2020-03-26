import got from 'got'
import open from 'open'
import path from 'path'
import fs from 'fs'
import mkdirp from 'mkdirp'
import { PublishMutation } from '@solui/graphql'
import { _, hash, uploadDataToIpfs } from '@solui/utils'
import { getUsedContracts, assertSpecValid } from '@solui/processor'

import { getApiClient } from './client'
import { logInfo, logTrace, logWarn, sleep } from './utils'
import config from './config'


export const publish = async ({ spec, artifacts, customIpfs, customFolder }) => {
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

  const dataToPublish = { spec, artifacts: artifactsToPublish }

  if (customFolder) {
    logTrace(`Publishing Dapp ${spec.id} to folder: ${customFolder} ...`)

    // fetch renderer from IPFS
    const indexPage = await got(`${config.SOLUI_RENDERER_HOST}/index.html`)
    const jsScript = await got(`${config.SOLUI_RENDERER_HOST}/index.js`)

    // create folder if necessary
    logTrace(`Ensuring folder exists ...`)
    mkdirp.sync(customFolder)

    // put path to Dapp json into html
    const htmlStr = indexPage.body.replace(
      '<script',
      `<script type="text/javascript">
        window.location.hash='#l=./dapp.json';
      </script><script`
    )

    // write files
    logTrace(`Writing output ...`)
    fs.writeFileSync(path.join(customFolder, 'index.html'), htmlStr, 'utf-8')
    fs.writeFileSync(path.join(customFolder, 'index.js'), jsScript.body, 'utf-8')
    fs.writeFileSync(path.join(customFolder, 'dapp.json'), JSON.stringify(dataToPublish), 'utf-8')

    logTrace('Published successfully!')

    logInfo(`Output:`, customFolder)
  } else if (customIpfs) {
    logTrace(`Publishing Dapp ${spec.id} to custom IPFS: ${customIpfs} ...`)

    const [ { hash: cid } ] = await uploadDataToIpfs(
      JSON.stringify(dataToPublish),
      customIpfs
    )

    logTrace('Published successfully!')

    logInfo(`CID:`, cid)
    logInfo(`View:`, `${config.SOLUI_RENDERER_HOST}#l=<YOUR_IPFS_GATEWAY>/${cid}`)
  } else {
    logTrace(`Publishing Dapp ${spec.id} to solUI cloud ...`)

    const client = getApiClient()

    let ret = await client.safeMutate({
      mutation: PublishMutation,
      variables: {
        bundle: dataToPublish
      }
    })

    const { finalizeUrl } = _.get(ret, 'data.result', {})

    if (finalizeUrl) {
      logInfo(`Please follow this link to complete publication:`, finalizeUrl)

      await open(finalizeUrl)

      let published = false

      // keep checking until the item is fully published
      while (!published) {
        await sleep(5)

        ret = await client.safeMutate({
          mutation: PublishMutation,
          variables: {
            bundle: dataToPublish
          }
        })

        published = !!_.get(ret, 'data.result.url')
      }
    }

    const { cid, url, shortUrl } = _.get(ret, 'data.result', {})

    logTrace('Published successfully!')

    logInfo(`CID:`, cid)
    logInfo(`URL (IPFS link):`, url)
    logInfo(`Short URL (redirects to IPFS link):`, shortUrl)
  }
}
