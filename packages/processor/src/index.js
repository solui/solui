import { _, slugify, promiseSerial, createErrorWithDetails, getContractDeployer, getContractAt } from '@solui/utils'

import {
  extractChildById,
  reportTransactionProgress,
  reportExecutionFailure,
  reportExecutionSuccess,
  generateId,
} from './utils'
import {
  checkVersionIsValid,
  checkImageIsValid,
  checkTitleIsValid,
} from './validate'
import { RootContext } from './context'
import { process as processPanel } from './panels'
import { processList as processConstants } from './constants'

export { RootContext }

/**
 * Process a [UI spec](https://solui.dev/docs/specification).
 *
 * This is the core parser/processor function. Use this to parse a spec and
 * operate on its components in any custom manner you desire.
 *
 * @param  {Object}  params                Parameters.
 * @param  {Object}  params.spec           The UI specification.
 * @param  {Object}  params.artifacts      Contract artifacts.
 * @param  {Network}    [params.network]      Network connection. Makes on-chain validation possible.
 * @param  {Object}  [callbacks={}]        Processor callbacks.
 *
 * @return {Promise<RootContext>}
 */
export const process = async ({ spec, artifacts, network }, callbacks = {}) => {
  const { version, title, description, image, constants, panels } = (spec || {})

  const ctx = new RootContext('<root>', { artifacts, callbacks, network })

  checkTitleIsValid(ctx, title)
  ctx.id = generateId(spec)

  checkVersionIsValid(ctx, version)

  if (image) {
    await checkImageIsValid(ctx, image)
  }

  await processConstants(ctx, constants)

  if (_.isEmpty(panels)) {
    ctx.recordError('must have at least one panel')
  }

  if (!ctx.errors().notEmpty) {
    await ctx.callbacks().startUi(ctx.id, { title, description, image })

    const existingPanels = {}

    await promiseSerial(panels, async panelConfig => {
      const panelId = _.get(panelConfig, 'id')

      if (!panelId) {
        ctx.recordError(`panel missing id`)
      } else if (existingPanels[panelId]) {
        ctx.recordError(`duplicate panel id: ${panelId}`)
      } else {
        existingPanels[panelId] = true
        await processPanel(ctx, panelId, panelConfig)
      }
    })

    await ctx.callbacks().endUi(ctx.id)
  }

  return ctx
}

/**
 * Validate a [UI spec](https://solui.dev/docs/specification).
 *
 * @param  {Object}  params                Parameters.
 * @param  {Object}  params.spec           The UI specification.
 * @param  {Object}  params.artifacts      Contract artifacts.
 * @param  {Network}    [params.network]      Network connection. Makes on-chain validation possible.
 *
 * @throw {Error} If validation errors occur. The `details` property will
 * contain the individual errors.
 *
 * @return {Promise}
 */
export const assertSpecValid = async ({ spec, artifacts, network }) => {
  const ctx = await process({ spec, artifacts, network })

  const errors = ctx.errors()

  if (errors.notEmpty) {
    throw createErrorWithDetails('There were one or more validation errors. See details.', errors.toStringArray())
  }
}

/**
 * Get names of contracts which are referenced in the given [UI spec](https://solui.dev/docs/specification).
 *
 * @param  {Object}  params                Parameters.
 * @param  {Object}  params.spec           The UI specification.
 *
 * @return {Array} List of canonical contract names.
 */
export const getUsedContracts = ({ spec }) => {
  const contractsUsed = {}

  const _parse = obj => {
    Object.keys(obj).forEach(k => {
      switch (typeof obj[k]) {
        case 'object':
          _parse(obj[k])
          break
        case 'string':
          if ('contract' === k) {
            contractsUsed[obj[k]] = true
          }
          break
        default:
          break
      }
    })
  }

  _parse(spec)

  return Object.keys(contractsUsed)
}

/**
 * Validate [panel](https://solui.dev/docs/specification/panels) inputs.
 *
 * @param  {Object}  params                Parameters.
 * @param  {Object}  params.spec           The UI specification.
 * @param  {Object}  params.artifacts      Contract artifacts.
 * @param  {String}  params.panelId      Id of panel.
 * @param  {Object}  params.inputs      The user input values.
 * @param  {Network}    [params.network]      Network connection. Makes on-chain validation possible.
 *
 * @throw {Error} If validation errors occur. The `details` property will
 * contain the individual errors.
 *
 * @return {Promise}
 */
export const validatePanel = async ({ artifacts, spec, panelId, inputs, network }) => (
  new Promise(async (resolve, reject) => {
    const panelConfig = extractChildById(_.get(spec, `panels`), panelId)
    if (!panelConfig) {
      reject(new Error(`panel not found: ${panelId}`))
      return
    }

    const ctx = new RootContext(generateId(spec), {
      artifacts,
      network,
      callbacks: {
        processInput: id => inputs[id],
      }
    })

    try {
      await processConstants(ctx, spec.constants)
      await processPanel(ctx, panelId, panelConfig)
    } catch (err) {
      ctx.recordError(`error validating panel: ${err}`)
    }

    if (ctx.errors().notEmpty) {
      reject(
        createErrorWithDetails('There were one or more validation errors. See details.', ctx.errors().toObject())
      )
    } else {
      resolve()
    }
  })
)

/**
 * Execute a [panel](https://solui.dev/docs/specification/panels).
 *
 * This will validate the inputs and make the configured on-chain calls,
 * executing all [tasks](https://solui.dev/docs/specification/execs) until outputs are obtained.
 *
 * @param  {Object}  params               Parameters.
 * @param  {Object}  params.spec          The UI specification.
 * @param  {Object}  params.artifacts     Contract artifacts.
 * @param  {String}  params.panelId       Id of panel.
 * @param  {Object}  params.inputs        The user input values.
 * @param  {Network}    params.network       Network connection.
 * @param  {Function} [params.progressCallback]   Progress callback.
 *
 * @throw {Error} If validation errors occur. The `details` property will
 * contain the individual errors.
 *
 * @return {Promise<Object>} Key-value pair of output values according to the
 * [outputs](https://solui.dev/docs/specification/outputs) configured for the panel.
 */
export const executePanel = async ({ artifacts, spec, panelId, inputs, network, progressCallback }) => (
  new Promise(async (resolve, reject) => {
    const { node } = network

    const panelConfig = extractChildById(_.get(spec, `panels`), panelId)
    if (!panelConfig) {
      reject(new Error(`panel not found: ${panelId}`))
      return
    }

    const ctx = new RootContext(generateId(spec), {
      artifacts,
      network,
      callbacks: {
        processInput: id => inputs[id],
        deployContract: async (id, { contract, abi, bytecode, args, successMessage, failureMessage }) => {
          try {
            await node.askWalletOwnerForPermissionToViewAccounts()

            const deployer = await getContractDeployer({ abi, bytecode, node })

            const inst = await deployer.deploy(...args)

            reportTransactionProgress(progressCallback, inst.deployTransaction)

            await inst.deployed()

            reportExecutionSuccess(progressCallback, successMessage)

            return inst.address
          } catch (err) {
            console.warn(err)
            reportExecutionFailure(progressCallback, failureMessage)
            ctx.errors().add(id, `error deploying ${contract}: ${err.message}`)
            return null
          }
        },
        sendTransaction: async (id, { contract, abi, method, address, args, ethValue, successMessage, failureMessage }) => {
          try {
            await node.askWalletOwnerForPermissionToViewAccounts()

            const contractInstance = await getContractAt({ abi, node, address })

            const tx = await (contractInstance[method](...args, {
              value: ethValue
            }))

            reportTransactionProgress(progressCallback, tx)

            await tx.wait()

            reportExecutionSuccess(progressCallback, successMessage)

            return true
          } catch (err) {
            reportExecutionFailure(progressCallback, failureMessage)
            ctx.errors().add(id, `error calling ${contract}.${method}: ${err.message}`)
            return null
          }
        },
        callMethod: async (id, { contract, abi, method, address, args }) => {
          try {
            await node.askWalletOwnerForPermissionToViewAccounts()

            const contractInstance = await getContractAt({ abi, node, address })

            return contractInstance[method](...args)
          } catch (err) {
            ctx.errors().add(id, `error calling ${contract}.${method}: ${err.message}`)
            return null
          }
        },
      }
    })

    try {
      await processConstants(ctx, spec.constants)
      await processPanel(ctx, panelId, panelConfig)
    } catch (err) {
      ctx.recordError(`error executing panel: ${err.message}`)
    }

    if (ctx.errors().notEmpty) {
      reject(
        createErrorWithDetails('There were one or more execution errors. See details.', ctx.errors().toStringArray())
      )
    } else {
      resolve(ctx.outputs())
    }
  })
)
