import { resolveValue } from './utils'
import { createChildContextFrom } from './context'
import { transformValue } from './transform'

const OUTPUT_TYPES = {
  address: true,
  bool: true,
  string: true,
  bytes: true,
  int: true,
  'bytes32[]': true,
  'int[]': true,
  'address[]': true,
}

const process = (ctx, config) => {
  if (!config) {
    return
  }

  const { type, value, title, transform = [] } = config

  // handle deprecated properties: unit, scale
  if (config.scale) {
    if (config.unit) {
      transform.unshift({ type: "stringToSpacedSuffixedString", suffix: config.unit })
    }
    transform.unshift({ type: "intToScaledIntString", scale: config.scale })
  }

  if (!type || !value || !title) {
    ctx.recordError(`output type, value and title must be specified`)
  } else {
    if (!OUTPUT_TYPES[type]) {
      ctx.recordError(`output type is not valid: ${type}`)
    }

    let result

    try {
      result = resolveValue(ctx, value)
    } catch (err) {
      ctx.recordError(`output value is not valid: ${value}`)
    }

    let resultTransformed

    if (typeof result !== 'undefined') {
      resultTransformed = transformValue(ctx, result, transform)
    }

    ctx.outputs().set(ctx.id, {
      ...config,
      result,
      resultTransformed,
    })
  }
}

export const processList = async (parentCtx, outputs) => {
  return Promise.all((outputs || []).map(async (outputConfig, ouputIndex) => {
    const ctx = createChildContextFrom(parentCtx, `output[${ouputIndex}]`)
    return process(ctx, outputConfig)
  }))
}
