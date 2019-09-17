import { _, promiseSerial } from '@solui/utils'

import { checkAddressIsValid } from './utils'

const _process = async (ctx, name, config) => ctx.callbacks().getInput(ctx.id, name, config)

const INPUTS = {
  address: {
    process: async (ctx, name, config) => {
      const result = await ctx.callbacks().getInput(ctx.id, name, config)

      if (result) {
        await checkAddressIsValid(ctx, result, config.addressType)
      }

      return result
    },
  },
  uint: {
    process: _process
  },
  int: {
    process: _process
  },
  bool: {
    process: _process
  },
  string: {
    process: _process
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
