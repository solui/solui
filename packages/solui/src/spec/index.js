import { _, promiseSerial, createErrorWithDetails } from '../utils'
import { getWeb3Account, isValidId, extractChildById } from './specUtils'
import { RootContext } from './context'
import { processGroup, processGroupInputs, processGroupPanel } from './group'

const SPEC_VERSION = [ 1 ]

const isValidVersion = version => (version === 1)

// process the spec
export const process = async ({ spec, artifacts }, callbacks = {}) => {
  const { id, version, description, groups } = (spec || {})

  const ctx = new RootContext(id, { artifacts, callbacks })

  let basicDetailsValid = true

  if (!isValidId(id)) {
    ctx.errors().add('spec must have a valid id (letters, numbers and hyphens only)')
    basicDetailsValid = false
  }

  if (!isValidVersion(version)) {
    ctx.errors().add(`spec version is invalid, valid versions are: ${SPEC_VERSION.join(', ')}`)
    basicDetailsValid = false
  }

  if (!description) {
    ctx.errors().add(ctx.id, 'must have a description')
    basicDetailsValid = false
  }

  if (_.isEmpty(groups)) {
    ctx.errors().add(ctx.id, 'must have atleast one group')
    basicDetailsValid = false
  }

  if (basicDetailsValid) {
    await ctx.callbacks().startUi(id, description)

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

    await ctx.callbacks().endUi(id, description)
  }

  return ctx
}

// assert that spec is valid
export const assertSpecValid = async ({ spec, artifacts }) => {
  const ctx = await process({ spec, artifacts })

  const errors = ctx.errors()

  if (errors.notEmpty) {
    throw createErrorWithDetails('There were one or more validation errors. See details.', errors.toStringArray())
  }
}

// validate group inputs
export const validateGroupInputs = async ({ artifacts, spec, groupId, inputs, web3 }) => (
  new Promise(async (resolve, reject) => {
    const groupConfig = extractChildById(_.get(spec, `groups`), groupId)
    if (!groupConfig) {
      reject(new Error(`group not found: ${groupId}`))
      return
    }

    const ctx = new RootContext(spec.id, {
      artifacts,
      web3,
      callbacks: {
        getInput: id => inputs[id],
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

// validate a panel
export const validatePanel = async ({ artifacts, spec, groupId, panelId, inputs, web3 }) => (
  new Promise(async (resolve, reject) => {
    const groupConfig = extractChildById(_.get(spec, `groups`), groupId)
    if (!groupConfig) {
      reject(new Error(`group not found: ${groupId}`))
      return
    }

    const ctx = new RootContext(spec.id, {
      artifacts,
      web3,
      callbacks: {
        getInput: id => inputs[id],
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

// Execute a panel
export const executePanel = async ({ artifacts, spec, groupId, panelId, inputs, web3 }) => (
  new Promise(async (resolve, reject) => {
    const groupConfig = extractChildById(_.get(spec, `groups`), groupId)
    if (!groupConfig) {
      reject(new Error(`group not found: ${groupId}`))
      return
    }

    const ctx = new RootContext(spec.id, {
      artifacts,
      web3,
      callbacks: {
        getInput: id => inputs[id],
        sendTransaction: async (id, { abi, method, address, args }) => {
          try {
            const from = await getWeb3Account(web3)

            const contract = new web3.eth.Contract(abi, address)

            return contract.methods[method](...args).send({ from })
          } catch (err) {
            ctx.errors().add(id, `Error executing: ${err}`)
            return null
          }
        },
        callMethod: async (id, { abi, method, address, args }) => {
          try {
            const from = await getWeb3Account(web3)

            const contract = new web3.eth.Contract(abi, address)

            return contract.methods[method](...args).call({ from })
          } catch (err) {
            ctx.errors().add(id, `Error executing: ${err}`)
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
            ctx.errors().add(id, `Error executing: ${err}`)
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
      resolve(ctx.output())
    }
  })
)
