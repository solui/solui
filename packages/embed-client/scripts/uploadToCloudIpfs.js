#!/usr/bin/env node
const got = require('got')
const chalk = require('chalk')
const path = require('path')
const { connectToPinata } = require('@solui/utils')

const BUILD_FOLDER = path.join(__dirname, '..', 'build')

const init = async () => {
  console.log('Logging into Pinata ...')

  const pinata = await connectToPinata(process.env.PINATA_API_KEY, process.env.PINATA_SECRET_KEY)

  console.log('Uploading ...')

  const ret = await pinata.pinFromFS(BUILD_FOLDER)

  console.log(ret)

  console.log(`\nView at: https://gateway.pinata.cloud/ipfs/${ret.IpfsHash}`)

  console.log(chalk.cyan(`\n(Remember to update DNS TXT record - _dnslink.ui.solui.dev - to point to this CID)`))
}

init().catch(err => {
  console.error(chalk.red(err.toString()))
  process.exit(-1)
})
