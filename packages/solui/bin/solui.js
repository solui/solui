/* eslint-disable import/no-dynamic-require */

import fs from 'fs'
import path from 'path'
import yargs from 'yargs'
import chalk from 'chalk'
import glob from 'glob'
import chokidar from 'chokidar'

import { startGenerator } from '../src'

const packageJson = require('../package.json')

const loadJson = f => JSON.parse(fs.readFileSync(f))

const loadArtifacts = dir => {
  const resolvedArtifactsDir = path.resolve(process.cwd(), dir)
  const resolvedArtifactsDirStat = fs.statSync(resolvedArtifactsDir)
  if (!resolvedArtifactsDirStat.isDirectory()) {
    throw new Error(`Error reading artifacts from ${dir}`)
  }

  const files = glob.sync(`${resolvedArtifactsDir}/*.json`, { absolute: true })

  if (!files.length) {
    throw new Error(`No artifacts found in ${dir}`)
  }

  return files.reduce((m, f) => {
    try {
      m[path.basename(f, '.json')] = loadJson(f)
    } catch (err) {
      throw new Error(`Error loading artifact ${f}: ${err}`)
    }
    return m
  }, {})
}

const loadSpec = file => {
  const resolvedSpecFile = path.resolve(process.cwd(), file)
  try {
    return loadJson(resolvedSpecFile)
  } catch (err) {
    throw new Error(`Error loading spec ${file}: ${err}`)
  }
}

const watch = (pth, callback) => {
  const prefix = `watcher[${pth}]`
  const log = m => console.log(chalk.grey(`${prefix}: ${m}`))
  const logErr = m => console.error(chalk.red(`${prefix}: ${m}`))

  log('Watching for changes...')

  const watcher = chokidar.watch(path.resolve(process.cwd(), pth))

  const handler = () => {
    log('Change detected...')

    try {
      callback()
    } catch (err) {
      logErr(`Callback error: ${err}`)
    }
  }

  watcher.on('add', handler)
  watcher.on('change', handler)
  watcher.on('unlink', handler)

  watcher.on('error', err => {
    logErr(`Error: ${err}`)
  })
}

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
  console.log(chalk.white(`> solui web interface is now accessible at ${instance.getEndpoint()}`))

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
