import {
  _,
  promiseSerial,
  deriveRealNumber,
} from '@solui/utils'

import { validateInputValue } from './validate'

const _process = async (ctx, name, config) => ctx.callbacks().processInput(ctx.id, name, config)

const INPUTS = {
  address: {
    process: async (ctx, name, config) => {
      const result = await ctx.callbacks().processInput(ctx.id, name, config)

      if (result) {
        await validateInputValue(ctx, result, config)
      }

      return result
    },
  },
  int: {
    process: async (ctx, name, config) => {
      const result = await ctx.callbacks().processInput(ctx.id, name, config)

      let realVal

      if (result) {
        await validateInputValue(ctx, result, config)
        realVal = deriveRealNumber(result, config)
      }

      return realVal ? realVal.toString(10) : undefined
    },
  },
  bool: {
    process: _process
  },
  string: {
    process: async (ctx, name, config) => {
      const result = await ctx.callbacks().processInput(ctx.id, name, config)

      if (result) {
        await validateInputValue(ctx, result, config)
      }

      return result
    },
  },
  bytes32: {
    process: _process
  },
}

export const processList = async (parentCtx, inputs) => (
  promiseSerial(inputs || [], async inputConfig => {
    const name = _.get(inputConfig, 'name')

    if (!name) {
      parentCtx.errors().add(parentCtx.id, `input is missing name`)
      return
    }

    const ctx = parentCtx.createChildContext(`input[${name}]`)

    const { title, type } = inputConfig

    if (!title) {
      ctx.errors().add(ctx.id, `must have a title`)
    }

    if (!INPUTS[type]) {
      ctx.errors().add(ctx.id, `must have a valid type: ${Object.keys(INPUTS).join(', ')}`)
    }

    ctx.inputs()[name] = await INPUTS[type].process(ctx, name, inputConfig)
  })
)
