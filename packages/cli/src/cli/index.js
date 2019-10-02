/* eslint-disable import/no-dynamic-require */

import glob from 'glob'
import path from 'path'
import commandLineArgs from 'command-line-args'
import commandLineUsage from 'command-line-usage'

import { exit, logError } from '../utils'

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

// show usage guide
function helpCommand (comm) {
  if (comm) {
    if (!COMMANDS[comm]) {
      logError(`Unrecognized command: ${comm}`)
    } else {
      const { summary, params, options } = COMMANDS[comm].getMeta()

      const sections = [
        {
          header: `solui: ${comm}`,
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

      exit()
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

  exit()
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

    helpCommand(commandForHelp)
  }

  if (!COMMANDS[command]) {
    helpCommand(command)
  }

  // command is valid so let's continue
  const { params = [], options = [] } = COMMANDS[command].getMeta()

  let args

  try {
    const defs = params.concat(options)

    args = defs.length
      ? commandLineArgs(defs, { argv, stopAtFirstUnknown: true })
      : {}

    // invalid args?
    if (args._unknown) {
      throw new Error(`Invalid argument: ${args._unknown}`)
    }

    // check that all param values are provided
    params.forEach(({ name }) => {
      if (undefined === args[name]) {
        throw new Error(`Missing parameter: ${name}`)
      }
    })
  } catch (err) {
    logError(err.message)
    helpCommand(command)
  }

  // execute
  await COMMANDS[command].execute(args)
}

main().catch(err => {
  logError(err.message)
  exit()
})
