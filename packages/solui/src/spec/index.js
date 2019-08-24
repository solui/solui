import { _, promiseSerial, createErrorWithDetails } from '../utils'
import { ProcessingErrors } from './specUtils'
import { process as processPanel } from './panel'

const DEFAULT_CALLBACKS = {
  startUi: async () => {},
  endUi: async () => {},
  getInput: async () => {},
  deployContract: async () => {},
  callMethod: async () => {},
  sendTransaction: async () => {},
}

export const process = async ({ spec, artifacts }, callbacks = {}) => {
  const ctx = {
    artifacts,
    errors: new ProcessingErrors(),
    inputs: {},
    callbacks: { ...DEFAULT_CALLBACKS, ...callbacks },
  }

  if (_.isEmpty(spec)) {
    ctx.errors.add('UI spec is empty')
  } else {
    await promiseSerial(spec, async (id, config) => processPanel(ctx, id, config))
  }

  return ctx
}

export const assertSpecValid = async ({ spec, artifacts }) => {
  const { errors } = await process({ spec, artifacts })

  if (errors.notEmpty) {
    throw createErrorWithDetails('There were one or more validation errors. See details.', errors.toStringArray())
  }
}

export const validateUi = async ({ artifacts, ui, inputs }) => (
  new Promise(async (resolve, reject) => {
    const ctx = {
      artifacts,
      errors: new ProcessingErrors(),
      inputs: {},
      callbacks: {
        ...DEFAULT_CALLBACKS,
        getInput: id => inputs[id],
      },
    }

    try {
      await processPanel(ctx, ui.id, ui.config)
    } catch (err) {
      ctx.errors.add(`Error validating UI: ${err}`)
    }

    if (ctx.errors.notEmpty) {
      reject(
        createErrorWithDetails('There were one or more validation errors. See details.', ctx.errors.toObject())
      )
    } else {
      resolve()
    }
  })
)

// Execute a UI operation
export const executeUi = async ({ artifacts, ui, inputs, web3 }) => (
  new Promise(async (resolve, reject) => {
    const ctx = {
      artifacts,
      errors: new ProcessingErrors(),
      inputs: {},
      callbacks: {
        ...DEFAULT_CALLBACKS,
        getInput: id => inputs[id],
        sendTransaction: async (id, { abi, method, address, args }) => {
          try {
            const [ from ] = await web3.eth.getAccounts()

            const contract = new web3.eth.Contract(abi, address)

            return contract.methods[method](...args).send({ from })
          } catch (err) {
            ctx.errors.add(id, `Error executing: ${err}`)
            return null
          }
        },
        callMethod: async (id, { abi, method, address, args }) => {
          try {
            const [ from ] = await web3.eth.getAccounts()

            const contract = new web3.eth.Contract(abi, address)

            return contract.methods[method](...args).call({ from })
          } catch (err) {
            ctx.errors.add(id, `Error executing: ${err}`)
            return null
          }
        },
        deployContract: async (id, { abi, bytecode, args }) => {
          try {
            const [ from ] = await web3.eth.getAccounts()

            const contract = new web3.eth.Contract(abi)

            const inst = await contract.deploy({
              data: bytecode,
              arguments: args,
            }).send({ from })

            return inst.options.address
          } catch (err) {
            ctx.errors.add(id, `Error executing: ${err}`)
            return null
          }
        }
      },
    }

    try {
      await processPanel(ctx, ui.id, ui.config)
    } catch (err) {
      ctx.errors.add(`Error executing UI: ${err}`)
    }

    if (ctx.errors.notEmpty) {
      reject(
        createErrorWithDetails('There were one or more execution errors. See details.', ctx.errors.toStringArray())
      )
    } else {
      resolve(ctx.output)
    }
  })
)
