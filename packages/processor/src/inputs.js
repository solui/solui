import {
  _,
  promiseSerial,
  deriveDecimalVal,
} from '@solui/utils'

import { validateInputValue } from './validate'
import { resolveValue } from './utils'

const process = async (ctx, name, config) => {
  const result = await ctx.callbacks().processInput(ctx.id, name, config)

  if (result) {
    await validateInputValue(ctx, result, config)
  }

  return result
}

const INPUTS = {
  int: {
    process: async (ctx, name, config) => {
      const result = await process(ctx, name, config)

      let finalVal

      if (result) {
        await validateInputValue(ctx, result, config)
        finalVal = deriveDecimalVal(result, config)
      }

      return finalVal ? finalVal.toString(10) : undefined
    },
  },
  address: { process },
  bool: { process },
  string: { process },
  bytes32: { process },
  'int[]': { process },
  'bytes32[]': { process },
  'bool[]': { process },
  'address[]': { process },
}

export const processList = async (parentCtx, inputs) => (
  promiseSerial(inputs || [], async inputConfig => {
    const name = _.get(inputConfig, 'name')

    if (!name) {
      parentCtx.errors().add(parentCtx.id, `input is missing name`)
      return
    }

    const ctx = parentCtx.createChildContext(`input[${name}]`)

    const { title, type, initialValue } = inputConfig

    if (!title) {
      ctx.errors().add(ctx.id, `must have a title`)
    }

    if (!INPUTS[type]) {
      ctx.errors().add(ctx.id, `must have a valid type: ${Object.keys(INPUTS).join(', ')}`)
    }


    // resolve initial value
    try {
      if (!_.isEmpty(initialValue)) {
        inputConfig.resolvedInitialValue = resolveValue(ctx, initialValue)
      }
    } catch (err) {
      ctx.errors().add(ctx.id, `initial value is invalid: ${err.message}`)
    }

    const res = await INPUTS[type].process(ctx, name, inputConfig)

    ctx.inputs().set(name, res)
  })
)
