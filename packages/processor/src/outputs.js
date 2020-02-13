import { resolveValue } from './utils'

const OUTPUT_TYPES = {
  address: true,
  bool: true,
  string: true,
  bytes: true,
  int: true,
}

const process = (ctx, config) => {
  if (!config) {
    return
  }

  const { type, value, title } = config

  if (!type || !value || !title) {
    ctx.errors().add(ctx.id, `output type, value and title must be specified`)
  } else {
    if (!OUTPUT_TYPES[type]) {
      ctx.errors().add(ctx.id, `output type is not valid: ${type}`)
    }

    let resolvedValue

    try {
      resolvedValue = resolveValue(ctx, value)
    } catch (err) {
      ctx.errors().add(ctx.id, `output value is not valid: ${value}`)
    }

    ctx.outputs().set(ctx.id, {
      ...config,
      result: resolvedValue,
    })
  }
}

export const processList = async (parentCtx, outputs) => {
  return Promise.all((outputs || []).map(async (outputConfig, ouputIndex) => {
    const ctx = parentCtx.createChildContext(`output[${ouputIndex}]`)
    return process(ctx, outputConfig)
  }))
}
