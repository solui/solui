import { inputIsPresent } from './specUtils'

const OUTPUT_TYPES = {
  address: true,
}

export const process = (ctx, config) => {
  if (!config) {
    return
  }

  const { type, param, title } = config

  if (!type || !param || !title) {
    ctx.errors.add(`output type, param and title must be specified`)
  } else {
    if (!OUTPUT_TYPES[type]) {
      ctx.errors.add(`output type is not valid: ${type}`)
    }

    if (!inputIsPresent(ctx, param)) {
      ctx.errors.add(`output param is not a valid input or result: ${param}`)
    }

    ctx.output = ctx.inputs[param]
  }
}
