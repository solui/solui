/* eslint-disable import/no-dynamic-require */

import glob from 'glob'
import path from 'path'
import commandLineArgs from 'command-line-args'
import commandLineUsage from 'command-line-usage'
import chalk from 'chalk'

import { loadSpec, loadArtifacts, watch } from './utils'
import packageJson from '../package.json'
import { startGenerator, publish } from './'

// load commands
const COMMANDS = glob.sync(path.join(__dirname, 'commands', '*.js')).reduce((m, file) => {
  m[path.basename(file, '.js')] = require(file)
  return m
}, {})


const renderParams = params => {
  return (params || []).reduce((m, { name, typeLabel }) => {
    m.push(`--${name} ${typeLabel || ''}`)
    return m
  }, []).join(' ')
}

let hasError = false

const exit = () => {
  process.exit(hasError ? -1 : 0)
}

const logError = msg => {
  hasError = true
  console.error(chalk.red(msg))
}


// show usage guide
function helpCommand (comm) {
  if (comm) {
    if (!COMMANDS[comm]) {
      logError(`Unrecognized command: ${comm}`)
    } else {
      const { summary, params, options } = COMMANDS[comm].getMeta()

      const sections = [
        {
          header: `solui ${comm}`,
          content: summary,
        },
        {
          header: 'Usage',
          content: `solui ${comm} ${renderParams(params)} ${options ? '[options]' : ''}`
        },
        ...(params ? [ {
          header: 'Parameters',
          optionList: params,
        } ] : []),
        ...(options ? [ {
          header: 'Options',
          optionList: options,
        } ] : []),
      ]

      console.log(commandLineUsage(sections))

      return
    }
  }

  const sections = [
    {
      header: 'solui',
      content: 'Render and publish declarative UIs for smart contracts. For more information see https://solui.dev.'
    },
    {
      header: 'Usage',
      content: '$ solui <command> [options]'
    },
    {
      header: 'Commands',
      content: Object.entries(COMMANDS).map(([ name, { getMeta } ]) => ({
        name,
        summary: getMeta().summary,
      })).concat({
        name: 'help',
        summary: 'Print this usage guide. Use "help <command>" for help on a specific command.'
      }),
    }
  ]

  console.log(commandLineUsage(sections))
}

async function main () {
  const { command, _unknown: argv = [] } = commandLineArgs([
    { name: 'command', defaultOption: true }
  ], {
    stopAtFirstUnknown: true
  })

  if ('help' === command) {
    const { commandForHelp } = commandLineArgs([
      { name: 'commandForHelp', defaultOption: true }
    ], { argv })

    return helpCommand(commandForHelp)
  }

  if (!COMMANDS[command]) {
    return helpCommand(command)
  }

  // command is valid so let's continue
  // case 'publish': {
  //   await publishCommand()
  //   break
  // }
  // case 'render':
  // default: {
  //   const renderOptions = commandLineArgs([
  //     { name: 'verbose', type: Boolean, alias: 'v' },
  //     { name: 'artifacts' },
  //     { name: 'spec' },
  //   ])
  //
  //   await renderCommand()
  // }

  //
  // // CLI options
  // const argv = yargs
  //   .usage('Usage: $0 [options] --artifacts /path/to/artifacts-folder --spec path/to/ui.json')
  //   .describe('verbose', 'Verbose logging')
  //   .describe('artifacts', 'Path to folder containing JSON artifcats for all contracts')
  //   .nargs('artifacts', 1)
  //   .describe('spec', 'Path to UI specification JSON file')
  //   .nargs('spec', 1)
  //   .describe('web-port', 'Port for web server')
  //   .nargs('port', 1)
  //   .default('port', '3001')
  //   .describe('version', 'Output version.')
  //   .demandOption([ 'artifacts', 'spec' ])
  //   .help('h')
  //   .alias('h', 'help')
  //   .parse(process.argv.slice(1))
  //
  // if (argv.version) {
  //   console.log(`${packageJson.name} ${packageJson.version}`)
  //   process.exit(0)
  // }
  //
  // const {
  //   artifacts: artifactsDir,
  //   spec: specFile,
  //   port,
  // } = argv
  //
  // // load data
  // const spec = loadSpec(specFile)
  // const artifacts = loadArtifacts(artifactsDir)
  //
  // // start generator
  // const instance = await startGenerator({ artifacts, spec, port, debug: argv.verbose })
  //
  // console.log(chalk.white(`Loaded ${Object.keys(artifacts).length} contracts from directory: ${artifactsDir}`))
  // console.log(chalk.white(`Loaded UI spec from: ${specFile}`))
  // console.log('')
  // console.log(chalk.cyan(`Interface available at: ${instance.getLocalEndpoint()}`))
  //
  // // watch for changes
  // watch(specFile, () => instance.updateSpec(loadSpec(specFile)))
  // watch(artifactsDir, () => instance.updateArtifacts(loadArtifacts(artifactsDir)))
}

main().then(
  () => exit(),
  err => {
    logError(err)
    exit()
  }
)
