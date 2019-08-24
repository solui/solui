import { _, promiseSerial } from '../utils'
import { process as processPanel } from './panel'

const DEFAULT_CALLBACKS = {
  startUi: async () => {},
  endUi: async () => {},
  getInput: async () => true,
  deployContract: async () => {},
}

export const process = async ({ ui, artifacts }, callbacks = {}) => {
  const ctx = {
    artifacts,
    errors: [],
    inputs: {},
    outputs: {},
    callbacks: { ...DEFAULT_CALLBACKS, ...callbacks },
  }

  if (_.isEmpty(ui)) {
    ctx.errors.push('UI spec is empty.')
  } else {
    await promiseSerial(ui, async (id, config) => processPanel(ctx, id, config))
  }

  return ctx.errors
}

export const assertValid = async ({ ui, artifacts }) => {
  const errors = await process({ ui, artifacts })

  if (errors.length) {
    const e = new Error(`There were one or more validation errors. See details.`)
    e.details = errors
    throw e
  }
}

// Execute a UI operation
// export const executeUi = async ({ artifacts, execSteps, inputValues, web3 }) => {
//
// }
