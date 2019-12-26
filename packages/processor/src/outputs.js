import { inputIsPresent } from './utils'

const OUTPUT_TYPES = {
  address: true,
  bool: true,
  string: true,
  bytes: true,
  uint: true,
  int: true,
}

const process = (ctx, config) => {
  if (!config) {
    return
  }

  const { type, param, title } = config

  if (!type || !param || !title) {
    ctx.errors().add(ctx.id, `output type, param and title must be specified`)
  } else {
    if (!OUTPUT_TYPES[type]) {
      ctx.errors().add(ctx.id, `output type is not valid: ${type}`)
    }

    if (!inputIsPresent(ctx, param)) {
      ctx.errors().add(ctx.id, `output param is not a valid input or result: ${param}`)
    }

    ctx.outputs()[ctx.id] = {
      ...config,
      result: ctx.inputs()[param],
    }
  }
}

export const processList = async (parentCtx, outputs) => {
  return Promise.all((outputs || []).map(async (outputConfig, ouputIndex) => {
    const ctx = parentCtx.createChildContext(`output[${ouputIndex}]`)
    return process(ctx, outputConfig)
  }))
}
