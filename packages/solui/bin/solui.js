import fs from 'fs'
import path from 'path'
import yargs from 'yargs'
import chalk from 'chalk'
import glob from 'glob'

import { startGenerator } from '../src'

const packageJson = require('../package.json')

// CLI options
const argv = yargs
  .usage('Usage: $0 [options] --artifacts /path/to/artifacts-folder --ui path/to/ui.json')
  .describe('artifacts', 'Path to folder containing JSON artifcats for all contracts')
  .nargs('artifacts', 1)
  .describe('ui', 'Path to UI specification JSON file')
  .nargs('ui', 1)
  .describe('web-port', 'Port for web server')
  .nargs('port', 1)
  .default('port', '3001')
  .describe('version', 'Output version.')
  .demandOption([ 'artifacts', 'ui' ])
  .help('h')
  .alias('h', 'help')
  .parse(process.argv.slice(1))

if (argv.version) {
  console.log(`${packageJson.name} ${packageJson.version}`)
  process.exit(0)
}

const {
  artifacts: artifactsDir,
  ui: uiFile,
  port,
} = argv

// load UI spec
let ui
try {
  // eslint-disable-next-line import/no-dynamic-require
  ui = require(path.resolve(process.cwd(), uiFile))
} catch (err) {
  throw new Error(`Error reading UI spec from ${uiFile}`)
}

// load contract artifacts
const dir = path.resolve(process.cwd(), artifactsDir)
const dirStat = fs.statSync(dir)
if (!dirStat.isDirectory()) {
  throw new Error(`Error reading artifacts from ${artifactsDir}`)
}

const files = glob.sync(`${dir}/*.json`, { absolute: true })
if (!files.length) {
  throw new Error(`No artifacts found in ${artifactsDir}`)
}

const artifacts = files.reduce((m, f) => {
  try {
    // eslint-disable-next-line import/no-dynamic-require
    m[path.basename(f, '.json')] = require(f)
  } catch (err) {
    throw new Error(`Error loading artifact: ${f}`)
  }
  return m
}, {})

startGenerator({ artifacts, ui, port })
  .then(instance => {
    console.log(chalk.grey(`Loaded ${Object.keys(artifacts).length} contracts from directory: ${artifactsDir}`))
    console.log(chalk.grey(`Loaded UI spec from: ${uiFile}`))
    console.log(chalk.grey(`...`))
    console.log(chalk.white(`> solui web interface is now accessible at ${instance.getEndpoint()}`))
  })
  .catch(err => {
    console.error(err)
    process.exit(-1)
  })
