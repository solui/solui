#!/usr/bin/env node
const got = require('got')
const chalk = require('chalk')
const path = require('path')
const { uploadFolderToIpfs, uploadDataToIpfs } = require('@solui/utils')

const BUILD_FOLDER = path.join(__dirname, '..', 'build')

const init = async () => {
  console.log('Logging in ...')

  let loginToken

  const { body } = await got.post('https://api.temporal.cloud/v2/auth/login', {
    json: true,
    body: { username: 'solui', password: process.env.TEMPORAL_PASSWORD },
  })

  if (body.token) {
    loginToken = body.token
  } else {
    throw new Error('No token obtained :/')
  }

  console.log('Uploading to Temporal Cloud ...')

  const ret = await uploadFolderToIpfs(BUILD_FOLDER, 'https://api.ipfs.temporal.cloud:443/api/v0', {
    headers: {
      Authorization: `Bearer ${loginToken}`
    }
  })

  console.log(`\nView at: https://gateway.temporal.cloud/ipfs/${ret[ret.length - 1].hash}`)

  console.log(chalk.cyan(`\n(Remember to update DNS TXT record - _dnslink.ui.solui.dev - to point to this cid)`))
}

init().catch(err => {
  console.error(chalk.red(err.toString()))
  process.exit(-1)
})
