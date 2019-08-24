import { _, promiseSerial } from '../utils'
import { inputIsPresent, methodArgExists, getBytecode, getAbi, getMethod } from './specUtils'

const validateContract = (ctx, config) => {
  // check contract
  const contractId = _.get(config, 'contract')

  if (!contractId) {
    ctx.errors.add(ctx.id, `must have a contract`)
  } else if (ctx.artifacts && !ctx.artifacts[contractId]) {
    ctx.errors.add(ctx.id, `must have a contract present in the artifacts list`)
  }
}

const validateContractMethod = (ctx, config) => {
  const contractId = _.get(config, 'contract')
  const method = _.get(config, 'method')

  if (!method) {
    ctx.errors.add(ctx.id, `must have a method`)
  } else {
    if (ctx.artifacts) {
      const methodAbi = getMethod(ctx, contractId, method)

      if (!methodAbi) {
        ctx.errors.add(ctx.id, `must specify a valid contract method`)
      }

      // check arg mappings
      _.each(_.get(config, 'args', {}), (inputId, argId) => {
        if (!methodArgExists(methodAbi, argId)) {
          ctx.errors.add(ctx.id, `method ${method} does not have arg: ${argId}`)
        }

        if (!inputIsPresent(ctx, inputId)) {
          ctx.errors.add(ctx.id, `method argument ${argId} maps from an invalid input: ${inputId}`)
        }
      })

      // check contract address mapping
      if ('deploy' !== config.type) {
        if (!_.get(config, 'address')) {
          ctx.errors.add(ctx.id, `must specify contract address mapping`)
        } else {
          if (!inputIsPresent(ctx, config.address)) {
            ctx.errors.add(ctx.id, `contract address maps from an invalid input: ${config.address}`)
          }
        }
      }
    }
  }
}


const buildMethodArgs = (methodAbi, args, inputs) => (
  (methodAbi.inputs || []).map(({ name }) => inputs[args[name]])
)

const prepareContractCall = (ctx, config) => {
  const contractId = config.contract
  const abi = getAbi(ctx, contractId)
  const methodAbi = getMethod(ctx, contractId, config.method)
  const args = buildMethodArgs(methodAbi, config.args, ctx.inputs)

  return { abi, args }
}

const EXECS = {
  deploy: {
    process: async (ctx, config) => {
      validateContract(ctx, config)
      validateContractMethod(ctx, { ...config, method: 'constructor' })

      const contractId = config.contract

      const bytecode = getBytecode(ctx, contractId)

      if (!bytecode) {
        ctx.errors.add(ctx.id, `is a deployment but matching artifact is missing bytecode`)
      } else {
        // prep
        const { abi, args } = prepareContractCall(ctx, { ...config, method: 'constructor' })
        // do it!
        const result = await ctx.callbacks.deployContract(ctx.id, { abi, bytecode, args })
        // further execs may need this output as input!
        if (config.saveResultAs) {
          ctx.inputs[config.saveResultAs] = result
        }
      }
    }
  },
  call: {
    process: async (ctx, config) => {
      validateContract(ctx, config)
      validateContractMethod(ctx, config)

      if (!config.saveResultAs) {
        ctx.errors.add(ctx.id, `must save its result into a param`)
      }

      // prep
      const { abi, args } = prepareContractCall(ctx, config)

      // do it!
      ctx.inputs[config.saveResultAs] = await ctx.callbacks.callMethod(
        ctx.id, {
          abi,
          method: config.method,
          args,
          address: ctx.inputs[config.address],
        }
      )
    }
  },
  send: {
    process: async (ctx, config) => {
      validateContract(ctx, config)
      validateContractMethod(ctx, config)

      // prep
      const { abi, args } = prepareContractCall(ctx, config)

      // do it!
      ctx.inputs[config.saveResultAs] = await ctx.callbacks.sendTransaction(
        ctx.id, {
          abi,
          method: config.method,
          args,
          address: ctx.inputs[config.address],
        }
      )
    }
  },
}

export const processList = async (ctx, execs) => (
  promiseSerial(execs, async (execId, execConfig) => {
    const newCtx = { ...ctx, id: `${ctx.parentId}.execs.${execId}` }

    // check execution step type
    const type = _.get(execConfig, 'type')

    if (!EXECS[type]) {
      ctx.errors.add(ctx.id, `must have a valid type: ${Object.keys(EXECS).join(', ')}`)
    } else {
      // eslint-disable-next-line no-await-in-loop
      await EXECS[type].process(newCtx, execConfig)
    }
  })
)
