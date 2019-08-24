import { _, promiseSerial } from '../utils'
import { process as processPanel } from './panel'

const DEFAULT_CALLBACKS = {
  startUi: async () => {},
  endUi: async () => {},
  getInput: async () => true,
  deployContract: async () => {},
}

export const process = async ({ spec, artifacts }, callbacks = {}) => {
  const ctx = {
    artifacts,
    errors: [],
    inputs: {},
    outputs: {},
    callbacks: { ...DEFAULT_CALLBACKS, ...callbacks },
  }

  if (_.isEmpty(spec)) {
    ctx.errors.push('UI spec is empty.')
  } else {
    await promiseSerial(spec, async (id, config) => processPanel(ctx, id, config))
  }

  return ctx.errors
}

export const assertValid = async ({ spec, artifacts }) => {
  const errors = await process({ spec, artifacts })

  if (errors.length) {
    const e = new Error(`There were one or more validation errors. See details.`)
    e.details = errors
    throw e
  }
}

// Execute a UI operation
export const executeUi = async ({ artifacts, ui, inputValues, web3 }) => {

}
