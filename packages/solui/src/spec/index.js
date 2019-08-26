import { _, promiseSerial, createErrorWithDetails } from '../utils'
import { ProcessingErrors, getWeb3Account, isValidId } from './specUtils'

import { process as processPanel } from './panel'
import { processList as processInputs } from './inputs'

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

  const id = _.get(spec, 'id')

  if (!isValidId(id)) {
    ctx.errors.add('spec must have a valid id (letters, numbers and hyphens only)')
  } else {
    if (!_.get(spec, 'description')) {
      ctx.errors.add('spec must have description')
    } else {
      ctx.id = id

      await processInputs(ctx, _.get(spec, 'inputs', {}))

      if (_.isEmpty(spec, 'panels')) {
        ctx.errors.add('spec must have atleast one panel')
      } else {
        await promiseSerial(spec.panels, async (panelId, panelConfig) => (
          processPanel(ctx, panelId, panelConfig)
        ))
      }
    }
  }

  return ctx
}

export const assertSpecValid = async ({ spec, artifacts }) => {
  const { errors } = await process({ spec, artifacts })

  if (errors.notEmpty) {
    throw createErrorWithDetails('There were one or more validation errors. See details.', errors.toStringArray())
  }
}

// validate a panel
export const validateUi = async ({ artifacts, ui, inputs, web3 }) => (
  new Promise(async (resolve, reject) => {
    const ctx = {
      artifacts,
      errors: new ProcessingErrors(),
      inputs: {},
      web3,
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

// Execute a panel
export const executeUi = async ({ artifacts, ui, inputs, web3 }) => (
  new Promise(async (resolve, reject) => {
    const ctx = {
      artifacts,
      errors: new ProcessingErrors(),
      inputs: {},
      web3,
      callbacks: {
        ...DEFAULT_CALLBACKS,
        getInput: id => inputs[id],
        sendTransaction: async (id, { abi, method, address, args }) => {
          try {
            const from = await getWeb3Account(web3)

            const contract = new web3.eth.Contract(abi, address)

            return contract.methods[method](...args).send({ from })
          } catch (err) {
            ctx.errors.add(id, `Error executing: ${err}`)
            return null
          }
        },
        callMethod: async (id, { abi, method, address, args }) => {
          try {
            const from = await getWeb3Account(web3)

            const contract = new web3.eth.Contract(abi, address)

            return contract.methods[method](...args).call({ from })
          } catch (err) {
            ctx.errors.add(id, `Error executing: ${err}`)
            return null
          }
        },
        deployContract: async (id, { abi, bytecode, args }) => {
          try {
            const from = await getWeb3Account(web3)

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
