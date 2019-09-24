/* eslint-disable import/no-dynamic-require */

import yargs from 'yargs'
import chalk from 'chalk'

import { loadSpec, loadArtifacts, watch } from './utils'
import packageJson from '../package.json'
import { startGenerator } from './'

async function main () {
  // CLI options
  const argv = yargs
    .usage('Usage: $0 [options] --artifacts /path/to/artifacts-folder --spec path/to/ui.json')
    .describe('verbose', 'Verbose logging')
    .describe('artifacts', 'Path to folder containing JSON artifcats for all contracts')
    .nargs('artifacts', 1)
    .describe('spec', 'Path to UI specification JSON file')
    .nargs('spec', 1)
    .describe('web-port', 'Port for web server')
    .nargs('port', 1)
    .default('port', '3001')
    .describe('version', 'Output version.')
    .demandOption([ 'artifacts', 'spec' ])
    .help('h')
    .alias('h', 'help')
    .parse(process.argv.slice(1))

  if (argv.version) {
    console.log(`${packageJson.name} ${packageJson.version}`)
    process.exit(0)
  }

  const {
    artifacts: artifactsDir,
    spec: specFile,
    port,
  } = argv

  // load data
  const spec = loadSpec(specFile)
  const artifacts = loadArtifacts(artifactsDir)

  // start generator
  const instance = await startGenerator({ artifacts, spec, port, debug: argv.verbose })

  console.log(chalk.white(`Loaded ${Object.keys(artifacts).length} contracts from directory: ${artifactsDir}`))
  console.log(chalk.white(`Loaded UI spec from: ${specFile}`))
  console.log('')
  console.log(chalk.green(`Interface available at: ${instance.getLocalEndpoint()}`))

  // watch for changes
  watch(specFile, () => instance.updateSpec(loadSpec(specFile)))
  watch(artifactsDir, () => instance.updateArtifacts(loadArtifacts(artifactsDir)))
}

main().catch(err => {
  console.error(err)
  process.exit(-1)
})


  .catch(err => {
    console.error(chalk.red(err))
    process.exit(-1)
  })
