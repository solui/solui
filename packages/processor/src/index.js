import { _, promiseSerial, createErrorWithDetails, getContractDeployer, getContractAt } from '@solui/utils'

import {
  extractChildById,
} from './utils'
import {
  checkIdIsValid,
  checkVersionIsValid,
  checkTitleIsValid,
  checkImageIsValid,
} from './validate'

import { RootContext } from './context'
import { processGroup, processGroupInputs, processGroupPanel } from './group'

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
 * @param  {Object}  [callbacks={}]        Processor callbacks.
 *
 * @return {Promise<RootContext>}
 */
export const process = async ({ spec, artifacts }, callbacks = {}) => {
  const { id, version, title, description, image, groups } = (spec || {})

  const ctx = new RootContext('<root>', { artifacts, callbacks })

  checkIdIsValid(ctx, id)

  // set to actual id if all ok!
  if (!ctx.errors().notEmpty) {
    ctx.id = id
  }

  checkVersionIsValid(ctx, version)
  checkTitleIsValid(ctx, title)

  if (image) {
    await checkImageIsValid(ctx, image)
  }

  if (_.isEmpty(groups)) {
    ctx.errors().add(ctx.id, 'must have at least one group')
  }

  if (!ctx.errors().notEmpty) {
    await ctx.callbacks().startUi(id, { title, description, image })

    const existingGroups = {}

    await promiseSerial(spec.groups, async groupConfig => {
      const groupId = _.get(groupConfig, 'id')

      if (!groupId) {
        ctx.errors().add(ctx.id, `group missing id`)
      } else if (existingGroups[groupId]) {
        ctx.errors().add(ctx.id, `duplicate group id: ${groupId}`)
      } else {
        existingGroups[groupId] = true
        await processGroup(ctx, groupId, groupConfig)
      }
    })

    await ctx.callbacks().endUi(id)
  }

  return ctx
}

/**
 * Validate a [UI spec](https://solui.dev/docs/specification).
 *
 * @param  {Object}  params                Parameters.
 * @param  {Object}  params.spec           The UI specification.
 * @param  {Object}  params.artifacts      Contract artifacts.
 *
 * @throw {Error} If validation errors occur. The `details` property will
 * contain the individual errors.
 *
 * @return {Promise}
 */
export const assertSpecValid = async ({ spec, artifacts }) => {
  const ctx = await process({ spec, artifacts })

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
 * Validate [group](https://solui.dev/docs/specification/groups) inputs.
 *
 * @param  {Object}  params                Parameters.
 * @param  {Object}  params.spec           The UI specification.
 * @param  {Object}  params.artifacts      Contract artifacts.
 * @param  {String}  params.groupId      Id of group within spec.
 * @param  {Object}  params.inputs      The user input values.
 * @param  {Node}  [params.node]      Node connection for on-chain validation.
 *
 * @throw {Error} If validation errors occur. The `details` property will
 * contain the individual errors.
 *
 * @return {Promise}
 */
export const validateGroupInputs = async ({ artifacts, spec, groupId, inputs, node }) => (
  new Promise(async (resolve, reject) => {
    const groupConfig = extractChildById(_.get(spec, `groups`), groupId)
    if (!groupConfig) {
      reject(new Error(`group not found: ${groupId}`))
      return
    }

    const ctx = new RootContext(spec.id, {
      artifacts,
      node,
      callbacks: {
        processInput: id => inputs[id],
      }
    })

    try {
      await processGroupInputs(ctx, groupId, groupConfig)
    } catch (err) {
      ctx.errors().add(ctx.id, `error validating group inputs: ${err}`)
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
 * Validate [panel](https://solui.dev/docs/specification/panels) inputs.
 *
 * @param  {Object}  params                Parameters.
 * @param  {Object}  params.spec           The UI specification.
 * @param  {Object}  params.artifacts      Contract artifacts.
 * @param  {String}  params.groupId      Id of group within spec.
 * @param  {String}  params.panelId      Id of panel within group.
 * @param  {Object}  params.inputs      The user input values.
 * @param  {Node}    [params.node]      Node connection. Makes on-chain validation possible.
 *
 * @throw {Error} If validation errors occur. The `details` property will
 * contain the individual errors.
 *
 * @return {Promise}
 */
export const validatePanel = async ({ artifacts, spec, groupId, panelId, inputs, node }) => (
  new Promise(async (resolve, reject) => {
    const groupConfig = extractChildById(_.get(spec, `groups`), groupId)
    if (!groupConfig) {
      reject(new Error(`group not found: ${groupId}`))
      return
    }

    const ctx = new RootContext(spec.id, {
      artifacts,
      node,
      callbacks: {
        processInput: id => inputs[id],
      }
    })

    try {
      await processGroupPanel(ctx, groupId, groupConfig, panelId)
    } catch (err) {
      ctx.errors().add(ctx.id, `error validating panel: ${err}`)
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
 * @param  {String}  params.groupId       Id of group within spec.
 * @param  {String}  params.panelId       Id of panel within group.
 * @param  {Object}  params.inputs        The user input values.
 * @param  {Node}    params.node          Node connection.
 *
 * @throw {Error} If validation errors occur. The `details` property will
 * contain the individual errors.
 *
 * @return {Promise<Object>} Key-value pair of output values according to the
 * [outputs](https://solui.dev/docs/specification/outputs) configured for the panel.
 */
export const executePanel = async ({ artifacts, spec, groupId, panelId, inputs, node }) => (
  new Promise(async (resolve, reject) => {
    const groupConfig = extractChildById(_.get(spec, `groups`), groupId)
    if (!groupConfig) {
      reject(new Error(`group not found: ${groupId}`))
      return
    }

    const ctx = new RootContext(spec.id, {
      artifacts,
      node,
      callbacks: {
        processInput: id => inputs[id],
        sendTransaction: async (id, { contract, abi, method, address, args }) => {
          try {
            const contractInstance = await getContractAt({ abi, node, address })

            const tx = await (contractInstance[method](...args))

            await tx.wait()

            return true
          } catch (err) {
            console.warn(err)
            ctx.errors().add(id, `Error calling ${contract}.${method}: ${err}`)
            return null
          }
        },
        callMethod: async (id, { contract, abi, method, address, args }) => {
          try {
            const contractInstance = await getContractAt({ abi, node, address })

            return contractInstance[method](...args)
          } catch (err) {
            console.warn(err)
            ctx.errors().add(id, `Error calling ${contract}.${method}: ${err}`)
            return null
          }
        },
        deployContract: async (id, { contract, abi, bytecode, args }) => {
          try {
            const deployer = await getContractDeployer({ abi, bytecode, node })

            const inst = await deployer.deploy(...args)

            await inst.deployed()

            return inst.address
          } catch (err) {
            console.warn(err)
            ctx.errors().add(id, `Error deploying ${contract}: ${err}`)
            return null
          }
        }
      }
    })

    try {
      await processGroupPanel(ctx, groupId, groupConfig, panelId)
    } catch (err) {
      ctx.errors().add(ctx.id, `error executing panel: ${err}`)
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
