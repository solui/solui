import _ from '../utils/lodash'
import { process as processPanel } from './panel'

const DEFAULT_PROCESSOR = {
  startUi: async () => {},
  endUi: async () => {},
  getInput: async () => true,
  deployContract: async () => {},
}

export const process = async ({ ui, artifacts }, processor) => {
  const ctx = {
    artifacts,
    errors: [],
    inputs: {},
    outputs: {},
    processor: { ...DEFAULT_PROCESSOR, processor },
  }

  if (_.isEmpty(ui)) {
    ctx.errors.push('UI spec is empty.')
  } else {
    await Promise.all(_.map(ui, (config, id) => processPanel(ctx, id, config)))
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
