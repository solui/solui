import { _, promiseSerial } from '../utils'
import { process as processPanel } from './panel'

const DEFAULT_CALLBACKS = {
  startUi: async () => {},
  endUi: async () => {},
  getInput: async () => {},
  deployContract: async () => {},
}

export const process = async ({ spec, artifacts }, callbacks = {}) => {
  const ctx = {
    artifacts,
    errors: [],
    inputs: {},
    callbacks: { ...DEFAULT_CALLBACKS, ...callbacks },
  }

  if (_.isEmpty(spec)) {
    ctx.errors.push('UI spec is empty.')
  } else {
    await promiseSerial(spec, async (id, config) => processPanel(ctx, id, config))
  }

  return ctx
}

export const assertValid = async ({ spec, artifacts }) => {
  const { errors } = await process({ spec, artifacts })

  if (errors.length) {
    const e = new Error(`There were one or more validation errors. See details.`)
    e.details = errors
    throw e
  }
}

// Execute a UI operation
export const executeUi = async ({ artifacts, ui, inputs, web3 }) => (
  new Promise(async (resolve, reject) => {
    const errors = []

    const ctx = {
      artifacts,
      errors,
      inputs: {},
      callbacks: {
        ...DEFAULT_CALLBACKS,
        getInput: id => inputs[id],
        deployContract: async (id, { abi, bytecode, args }) => {
          try {
            const [ from ] = await web3.eth.getAccounts()

            const contract = new web3.eth.Contract(abi)

            const receipt = await contract.deploy({
              data: bytecode,
              arguments: args,
            }).send({ from })

            console.warn(receipt)
          } catch (err) {
            errors.push(`Error executing ${id}: ${err}`)
          }
        }
      },
    }

    try {
      await processPanel(ctx, ui.id, ui.config)
    } catch (err) {
      errors.push(`Error executing UI: ${err}`)
    }

    if (errors.length) {
      const e = new Error('Execution error, see details.')
      e.details = errors
      reject(e)
    } else {
      resolve()
    }
  })
)
