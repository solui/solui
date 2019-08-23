import fs from 'fs'
import path from 'path'
import yargs from 'yargs'
import chalk from 'chalk'

import { startGenerator } from '../src'

const packageJson = require('../package.json')

// CLI options
const argv = yargs
  .usage('Usage: $0 [options]')
  .help('h')
  .alias('h', 'help')
  .describe('artifcats', 'Path to folder containing JSON artifcats for all contracts')
  .describe('ui', 'Path to UI specification JSON file')
  .describe('version', 'Output version.')
  .parse(process.argv.slice(1))

if (argv.version) {
  console.log(`${packageJson.name} ${packageJson.version}`)
  process.exit(0)
}

const {
  artifcats: artifactsDir,
  ui: uiFile
} = argv

// load UI spec
let ui
try {
  // eslint-disable-next-line import/no-dynamic-require
  ui = require(path.resolve(process.cwd(), uiFile))
} catch (err) {
  throw new Error(`Error reading UI spec from ${uiFile}`)
}

// check contracts dir
try {
  const dirStat = fs.statSync(path.resolve(process.cwd(), artifactsDir))
  if (!dirStat.isDirectory()) {
    throw new Error()
  }
} catch (err) {
  throw new Error(`Error reading contracts JSON artifcats from ${artifactsDir}`)
}


startGenerator({ artifactsDir, ui })
  .then(() => {
    console.log(chalk.grey(`Contracts directory: ${artifactsDir}`))
    console.log(chalk.grey(`UI spec: ${uiFile}`))
    console.log(chalk.grey(`...`))
    console.log(chalk.white(`> solui web interface is now accessible at ???`))
  })
  .catch(err => {
    console.error(err)
    process.exit(-1)
  })
