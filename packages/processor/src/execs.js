import { _, promiseSerial, deriveDecimalVal } from '@solui/utils'

import { resolveValue, methodArgExists, getBytecode, getAbi, getMethod } from './utils'
import { createChildContextFrom } from './context'

const validateContract = (ctx, config) => {
  // check contract
  const { contract } = config

  let foundError = false

  if (!contract) {
    ctx.recordError(`must have a contract`)
    foundError = true
  } else if (ctx.artifacts() && !ctx.artifacts()[contract]) {
    ctx.recordError(`must have a contract present in the artifacts list`)
    foundError = true
  }

  return !foundError
}

const validateContractMethod = (ctx, config) => {
  const { method, contract, args, address, type } = config

  let foundError = false

  if (!method) {
    foundError = true
    ctx.recordError(`must have a method`)
  } else {
    if (ctx.artifacts()) {
      const methodAbi = getMethod(ctx, contract, method)

      if (!methodAbi) {
        foundError = true
        ctx.recordError(`must specify a valid contract method`)
      } else {
        // check arg mappings
        _.each(args, (inputId, argId) => {
          if (!methodArgExists(methodAbi, argId)) {
            foundError = true
            ctx.recordError(`method ${method} does not have arg: ${argId}`)
          }

          try {
            resolveValue(ctx, inputId)
          } catch (err) {
            foundError = true
            ctx.recordError(`method argument ${argId} maps from an invalid value: ${inputId}`)
          }
        })

        // check contract address mapping
        if ('deploy' !== type) {
          if (!address) {
            foundError = true
            ctx.recordError(`must specify contract address mapping`)
          } else {
            try {
              resolveValue(ctx, address)
            } catch (err) {
              foundError = true
              ctx.recordError(`contract address maps from an invalid value: ${address}`)
            }
          }
        }
      }
    }
  }

  return !foundError
}


const buildMethodArgs = (ctx, methodAbi, args) => (
  (methodAbi.inputs || []).map(({ name }) => resolveValue(ctx, args[name]))
)

const prepareContractCall = (ctx, config) => {
  const { contract, method, args } = config
  const abi = getAbi(ctx, contract)
  const methodAbi = getMethod(ctx, contract, method)
  const methodArgs = buildMethodArgs(ctx, methodAbi, args)

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

      const { contract, saveResultAsInput } = config

      const bytecode = getBytecode(ctx, contract)

      if (!bytecode) {
        ctx.recordError(`is a deployment but matching artifact is missing bytecode`)
      } else {
        // prep
        const { abi, args } = prepareContractCall(ctx, { ...config, method: 'constructor' })
        // do it!
        const result = await ctx.callbacks().deployContract(
          ctx.id, {
            contract,
            abi,
            bytecode,
            args,
            successMessage: config.successMessage,
            failureMessage: config.failureMessage
          }
        )
        // further execs may need this output as input!
        if (saveResultAsInput) {
          ctx.inputs().set(saveResultAsInput, result)
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

      const { contract, saveResultAsInput, method, address } = config

      if (!saveResultAsInput) {
        ctx.recordError(`must save its result into a param`)
      }

      // prep
      const { abi, args } = prepareContractCall(ctx, config)

      let contractAddress
      try {
        contractAddress = resolveValue(ctx, address)
      } catch (err) {
        ctx.recordError(`contract address value is invalid: ${address}`)
      }

      // do it!
      const res = await ctx.callbacks().callMethod(ctx.id, {
        contract,
        abi,
        method,
        args,
        address: contractAddress,
        successMessage: config.successMessage,
        failureMessage: config.failureMessage
      })

      ctx.inputs().set(saveResultAsInput, res)
    }
  },
  send: {
    process: async (ctx, config) => {
      const isValid = validateContract(ctx, config) && validateContractMethod(ctx, config)

      if (!isValid) {
        return
      }

      const { contract, method, address, transferAmount, saveResultAsInput } = config

      if (saveResultAsInput) {
        ctx.recordError(`must not save its result into a param`)
      }

      // prep
      const { abi, args } = prepareContractCall(ctx, config)

      let contractAddress
      try {
        contractAddress = resolveValue(ctx, address)
      } catch (err) {
        ctx.recordError(`contract address value is invalid: ${address}`)
      }

      let ethValue = '0x0'
      try {
        if (transferAmount) {
          const ev = deriveDecimalVal(resolveValue(ctx, transferAmount))
          if (ev) {
            ethValue = ev.toHex()
          }
        }
      } catch (err) {
        ctx.recordError(`transferAmount invalid: ${err.message}`)
      }

      // do it!
      await ctx.callbacks().sendTransaction(
        ctx.id, {
          contract,
          abi,
          method,
          args,
          ethValue,
          address: contractAddress,
        }
      )
    }
  },
}

export const processList = async (parentCtx, execs) => (
  promiseSerial(execs || [], async (execConfig, execIndex) => {
    const ctx = createChildContextFrom(parentCtx, `exec[${execIndex}]`)

    if (_.isEmpty(execConfig)) {
      ctx.recordError(`must not be empty`)
    } else {
      // check execution step type
      const { type } = execConfig

      if (!EXECS[type]) {
        ctx.recordError(`must have a valid type: ${Object.keys(EXECS).join(', ')}`)
      } else {
        // eslint-disable-next-line no-await-in-loop
        await EXECS[type].process(ctx, execConfig)
      }
    }
  })
)
