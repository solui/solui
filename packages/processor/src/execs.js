import { _, promiseSerial } from '@solui/utils'

import { inputIsPresent, methodArgExists, getBytecode, getAbi, getMethod } from './utils'

const validateContract = (ctx, config) => {
  // check contract
  const { contract } = config

  let foundError = false

  if (!contract) {
    ctx.errors().add(ctx.id, `must have a contract`)
    foundError = true
  } else if (ctx.artifacts() && !ctx.artifacts()[contract]) {
    ctx.errors().add(ctx.id, `must have a contract present in the artifacts list`)
    foundError = true
  }

  return !foundError
}

const validateContractMethod = (ctx, config) => {
  const { method, contract, args, address, type } = config

  let foundError = false

  if (!method) {
    foundError = true
    ctx.errors().add(ctx.id, `must have a method`)
  } else {
    if (ctx.artifacts()) {
      const methodAbi = getMethod(ctx, contract, method)

      if (!methodAbi) {
        foundError = true
        ctx.errors().add(ctx.id, `must specify a valid contract method`)
      } else {
        // check arg mappings
        _.each(args, (inputId, argId) => {
          if (!methodArgExists(methodAbi, argId)) {
            foundError = true
            ctx.errors().add(ctx.id, `method ${method} does not have arg: ${argId}`)
          }

          if (!inputIsPresent(ctx, inputId)) {
            foundError = true
            ctx.errors().add(ctx.id, `method argument ${argId} maps from an invalid input: ${inputId}`)
          }
        })

        // check contract address mapping
        if ('deploy' !== type) {
          if (!address) {
            foundError = true
            ctx.errors().add(ctx.id, `must specify contract address mapping`)
          } else {
            if (!inputIsPresent(ctx, address)) {
              foundError = true
              ctx.errors().add(ctx.id, `contract address maps from an invalid input: ${address}`)
            }
          }
        }
      }
    }
  }

  return !foundError
}


const buildMethodArgs = (methodAbi, args, inputs) => (
  (methodAbi.inputs || []).map(({ name }) => inputs[args[name]])
)

const prepareContractCall = (ctx, config) => {
  const { contract, method, args } = config
  const abi = getAbi(ctx, contract)
  const methodAbi = getMethod(ctx, contract, method)
  const methodArgs = buildMethodArgs(methodAbi, args, ctx.inputs())

  return { abi, args: methodArgs }
}

const EXECS = {
  deploy: {
    process: async (ctx, config) => {
      const isValid = validateContract(ctx, config)
        && validateContractMethod(ctx, { ...config, method: 'constructor' })

      if (!isValid) {
        return
      }

      const { contract, saveResultAs } = config

      const bytecode = getBytecode(ctx, contract)

      if (!bytecode) {
        ctx.errors().add(ctx.id, `is a deployment but matching artifact is missing bytecode`)
      } else {
        // prep
        const { abi, args } = prepareContractCall(ctx, { ...config, method: 'constructor' })
        // do it!
        const result = await ctx.callbacks().deployContract(
          ctx.id, { contract, abi, bytecode, args }
        )
        // further execs may need this output as input!
        if (saveResultAs) {
          ctx.inputs()[saveResultAs] = result
        }
      }
    }
  },
  call: {
    process: async (ctx, config) => {
      const isValid = validateContract(ctx, config) && validateContractMethod(ctx, config)

      if (!isValid) {
        return
      }

      const { contract, saveResultAs, method, address } = config

      if (!saveResultAs) {
        ctx.errors().add(ctx.id, `must save its result into a param`)
      }

      // prep
      const { abi, args } = prepareContractCall(ctx, config)

      // do it!
      ctx.inputs()[saveResultAs] = await ctx.callbacks().callMethod(
        ctx.id, {
          contract,
          abi,
          method,
          args,
          address: ctx.inputs()[address],
        }
      )
    }
  },
  send: {
    process: async (ctx, config) => {
      const isValid = validateContract(ctx, config) && validateContractMethod(ctx, config)

      if (!isValid) {
        return
      }

      const { contract, method, address, saveResultAs } = config

      if (saveResultAs) {
        ctx.errors().add(ctx.id, `must not save its result into a param`)
      }

      // prep
      const { abi, args } = prepareContractCall(ctx, config)

      // do it!
      await ctx.callbacks().sendTransaction(
        ctx.id, {
          contract,
          abi,
          method,
          args,
          address: ctx.inputs()[address],
        }
      )
    }
  },
}

export const processList = async (parentCtx, execs) => (
  promiseSerial(execs || [], async (execConfig, execIndex) => {
    const ctx = parentCtx.createChildContext(`@exec[${execIndex}]`)

    if (_.isEmpty(execConfig)) {
      ctx.errors().add(ctx.id, `must not be empty`)
    } else {
      // check execution step type
      const { type } = execConfig

      if (!EXECS[type]) {
        ctx.errors().add(ctx.id, `must have a valid type: ${Object.keys(EXECS).join(', ')}`)
      } else {
        // eslint-disable-next-line no-await-in-loop
        await EXECS[type].process(ctx, execConfig)
      }
    }
  })
)
