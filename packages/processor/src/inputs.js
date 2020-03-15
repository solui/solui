import {
  _,
  promiseSerial,
} from '@solui/utils'

import { validateInputValue } from './validate'
import { resolveValue, finalizeInputValue } from './utils'
import { createChildContextFrom } from './context'

const process = async (ctx, name, config) => {
  const result = await ctx.callbacks().processInput(ctx.id, name, config)

  if (result) {
    await validateInputValue(ctx, result, config)

    return finalizeInputValue(ctx, result, config)
  }

  return undefined
}

const INPUTS = {
  int: { process },
  address: { process },
  bool: { process },
  string: { process },
  bytes32: { process },
  'int[]': { process },
  'bytes32[]': { process },
  'address[]': { process },
}

export const processList = async (parentCtx, inputs) => (
  promiseSerial(inputs || [], async inputConfig => {
    const name = _.get(inputConfig, 'name')

    if (!name) {
      parentCtx.recordError(`input is missing name`)
      return
    }

    const ctx = createChildContextFrom(parentCtx, `input[${name}]`)

    const { title, type, initialValue } = inputConfig

    if (!title) {
      ctx.recordError(`must have a title`)
    }

    if (!INPUTS[type]) {
      ctx.recordError(`must have a valid type: ${Object.keys(INPUTS).join(', ')}`)
    }


    // resolve initial value
    try {
      if (!_.isEmpty(initialValue)) {
        inputConfig.resolvedInitialValue = resolveValue(ctx, initialValue)
      }
    } catch (err) {
      ctx.recordError(`initial value is invalid: ${err.message}`)
    }

    const res = await INPUTS[type].process(ctx, name, inputConfig)

    ctx.inputs().set(name, res)
  })
)
