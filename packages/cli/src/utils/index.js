import { _ } from '@solui/utils'
import fs from 'fs'
import path from 'path'
import glob from 'glob'
import chokidar from 'chokidar'
import chalk from 'chalk'

export const loadJson = f => JSON.parse(fs.readFileSync(f))

export const loadArtifacts = dir => {
  const resolvedArtifactsDir = path.resolve(process.cwd(), dir)
  try {
    const resolvedArtifactsDirStat = fs.statSync(resolvedArtifactsDir)
    if (!resolvedArtifactsDirStat.isDirectory()) {
      throw new Error('not a directory')
    }
  } catch (err) {
    throw new Error(`Unable to load artifacts from ${dir}: ${err.message}`)
  }

  const files = glob.sync(`${resolvedArtifactsDir}/*.json`, { absolute: true })

  if (!files.length) {
    throw new Error(`No artifacts found in ${dir}`)
  }

  return files.reduce((m, f) => {
    try {
      const { abi, bytecode, deployedBytecode, contractName, networks } = loadJson(f)

      m[path.basename(f, '.json')] = { abi, bytecode, deployedBytecode, contractName, networks }
    } catch (err) {
      throw new Error(`Error loading artifact ${f}: ${err}`)
    }
    return m
  }, {})
}

export const loadSpec = file => {
  const resolvedSpecFile = path.resolve(process.cwd(), file)
  try {
    return loadJson(resolvedSpecFile)
  } catch (err) {
    throw new Error(`Error loading spec ${file}: ${err}`)
  }
}

export const watch = (pth, callback) => {
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
    logErr(`Watcher error: ${err}`)
  })
}

let hasError = false

export const exit = () => {
  process.exit(hasError ? -1 : 0)
}

export const logError = msg => {
  hasError = true
  console.error(chalk.red(msg))
}

const _log = (...msgs) => {
  console.log(`\n${msgs.join(' ')}`)
}

export const logTrace = msg => {
  _log(chalk.white(msg))
}

export const logWarn = msg => {
  _log(chalk.yellow(msg))
}

export const logInfo = (msg, ...more) => {
  const args = [ chalk.cyan(msg) ].concat(more.map(m => chalk.bold(m)))
  _log(...args)
}

export const loadSpecArtifacts = ({ specFile, artifactsDir }) => {
  // load data
  const spec = loadSpec(specFile)
  const artifacts = loadArtifacts(artifactsDir)

  logTrace(`Loaded ${Object.keys(artifacts).length} contracts from directory: ${artifactsDir}`)
  logTrace(`Loaded UI spec from: ${specFile}`)
  logTrace('')

  return { spec, artifacts }
}
