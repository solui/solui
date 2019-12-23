#!/usr/bin/env node
const chalk = require('chalk')
const path = require('path')
const { uploadFolderToIpfs } = require('@solui/utils')

const BUILD_FOLDER = path.join(__dirname, '..', 'build')

const init = async () => {
  console.log(`Uploading files...`)

  const ret = await uploadFolderToIpfs(BUILD_FOLDER, 'http://127.0.0.1:5001/api/v0')

  console.log('Done!')

  console.log(chalk.cyan(JSON.stringify(ret, null, 2)))

  console.log(`Folder CID: ${ret[ret.length - 1].hash}`)
}

init().catch(err => {
  console.dir(err)
  console.error(chalk.red(err.toString()))
  process.exit(-1)
})
