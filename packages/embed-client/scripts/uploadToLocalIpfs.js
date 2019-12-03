#!/usr/bin/env node
const chalk = require('chalk')
const path = require('path')
const { uploadFolderToIpfs } = require('@solui/utils')

const BUILD_FOLDER = path.join(__dirname, '..', 'build')

const init = async () => {
  console.log(`Uploading files...`)

  const ret = await uploadFolderToIpfs('http://127.0.0.1:5001/api/v0', BUILD_FOLDER)

  console.log('Done!')

  console.log(chalk.cyan(JSON.stringify(ret, null, 2)))
}

init().catch(err => {
  console.dir(err)
  console.error(chalk.red(err.toString()))
  process.exit(-1)
})
