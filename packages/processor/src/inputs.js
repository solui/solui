import {
  _,
  promiseSerial,
  EMPTY_INPUT_VALUES,
} from '@solui/utils'

import { validateInputValue, checkOptionsAreValid } from './validate'
import { resolveValue, finalizeInputValue } from './utils'
import { createChildContextFrom } from './context'

const buildProcessor = defaultVal => async (ctx, name, config) => {
  const result = await ctx.callbacks().processInput(ctx.id, name, config)

  if (result) {
    await validateInputValue(ctx, result, config)

    return finalizeInputValue(ctx, result, config)
  } else if (_.get(config, 'optional')) {
    return defaultVal
  }

  return undefined
}

const INPUTS = {
  int: { process: buildProcessor(EMPTY_INPUT_VALUES.INT) },
  address: { process: buildProcessor(EMPTY_INPUT_VALUES.ADDRESS) },
  bool: { process: buildProcessor(EMPTY_INPUT_VALUES.BOOL) },
  string: { process: buildProcessor(EMPTY_INPUT_VALUES.STRING) },
  bytes32: { process: buildProcessor(EMPTY_INPUT_VALUES.BYTES32) },
  'int[]': { process: buildProcessor(EMPTY_INPUT_VALUES.ARRAY) },
  'bytes32[]': { process: buildProcessor(EMPTY_INPUT_VALUES.ARRAY) },
  'address[]': { process: buildProcessor(EMPTY_INPUT_VALUES.ARRAY) },
}

export const processList = async (parentCtx, inputs) => (
  promiseSerial(inputs || [], async inputConfig => {
    const name = _.get(inputConfig, 'name')

    if (!name) {
      parentCtx.recordError(`input is missing name`)
      return
    }

    const ctx = createChildContextFrom(parentCtx, `input[${name}]`)

    const { title, type, initialValue, options } = inputConfig

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

    // resolve options
    try {
      if (!_.isEmpty(options)) {
        inputConfig.resolvedOptions = resolveValue(ctx, options)
          .reduce((m, { value: v, label: l }) => {
            m[v] = l
            return m
          }, {})

        checkOptionsAreValid(ctx, inputConfig.resolvedOptions)
      }
    } catch (err) {
      ctx.recordError(`options are invalid: ${err.message}`)
    }

    const res = await INPUTS[type].process(ctx, name, inputConfig)

    ctx.inputs().set(name, res)
  })
)
