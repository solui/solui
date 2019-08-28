import { _, promiseSerial, createErrorWithDetails } from '../utils'
import { ProcessingErrors, getWeb3Account, isValidId } from './specUtils'

import { process as processPanel } from './panel'
import { processList as processInputs } from './inputs'

const DEFAULT_CALLBACKS = {
  startUi: async () => {},
  endUi: async () => {},
  startPanel: async () => {},
  endPanel: async () => {},
  getInput: async () => {},
  deployContract: async () => {},
  callMethod: async () => {},
  sendTransaction: async () => {},
}

// process the spec
export const process = async ({ spec, artifacts }, callbacks = {}) => {
  const ctx = {
    artifacts,
    errors: new ProcessingErrors(),
    inputs: {},
    callbacks: { ...DEFAULT_CALLBACKS, ...callbacks },
  }

  const { id, description, inputs, panels } = (spec || {})

  let basicDetailsValid = true

  if (!isValidId(id)) {
    ctx.errors.add('spec must have a valid id (letters, numbers and hyphens only)')
    basicDetailsValid = false
  }

  ctx.id = id

  if (!description) {
    ctx.errors.add('spec must have description')
    basicDetailsValid = false
  }

  if (_.isEmpty(panels)) {
    ctx.errors.add('spec must have atleast one panel')
    basicDetailsValid = false
  }

  if (basicDetailsValid) {
    await ctx.callbacks.startUi(id, description)

    await processInputs(ctx, inputs)

    await promiseSerial(spec.panels, async (panelId, panelConfig) => (
      processPanel(ctx, panelId, panelConfig)
    ))

    await ctx.callbacks.endUi(id, description)
  }

  return ctx
}

// assert that spec is valid
export const assertSpecValid = async ({ spec, artifacts }) => {
  const { errors } = await process({ spec, artifacts })

  if (errors.notEmpty) {
    throw createErrorWithDetails('There were one or more validation errors. See details.', errors.toStringArray())
  }
}

// validate top-level inputs
export const validateTopLevelInputs = async ({ artifacts, spec, inputs, web3 }) => (
  new Promise(async (resolve, reject) => {
    const ctx = {
      id: spec.id,
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
      await processInputs(ctx, _.get(spec, 'inputs', {}))
    } catch (err) {
      ctx.errors.add(`Error validating top-level inputs: ${err}`)
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


// validate a panel
export const validatePanel = async ({ artifacts, spec, panelId, inputs, web3 }) => (
  new Promise(async (resolve, reject) => {
    const panelConfig = _.get(spec, `panels.${panelId}`)
    if (!panelConfig) {
      reject(new Error('Panel not found'))
    }

    const ctx = {
      id: spec.id,
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
      await processPanel(ctx, panelId, panelConfig)
    } catch (err) {
      ctx.errors.add(`Error validating panel: ${err}`)
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
export const executePanel = async ({ artifacts, spec, panelId, inputs, web3 }) => (
  new Promise(async (resolve, reject) => {
    const panelConfig = _.get(spec, `panels.${panelId}`)
    if (!panelConfig) {
      reject(new Error('Panel not found'))
    }

    const ctx = {
      id: spec.id,
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
      await processPanel(ctx, panelId, panelConfig)
    } catch (err) {
      ctx.errors.add(`Error executing panel: ${err}`)
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
