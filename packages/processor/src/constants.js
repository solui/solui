import { _ } from '@solui/utils'

import {
  checkIdIsValid,
} from './validate'

import { createChildContextFrom } from './context'

export const process = async (parentCtx, id, config) => {
  const ctx = createChildContextFrom(parentCtx, `constant[${id}]`)

  checkIdIsValid(ctx, id)

  if (ctx.constants().has(id)) {
    ctx.recordError(`duplicate definition`)
  } else {
    let errored = false

    switch (typeof config) {
      case 'object':
        if (!Object.keys(config).includes('default')) {
          ctx.recordError('must contain "default" key')
          errored = true
        } else {
          Object.keys(config).forEach(k => {
            if (typeof k !== 'string') {
              ctx.recordError('network ids must be string')
              errored = true
            }
          })
        }
        break
      default:
        ctx.recordError('must be a mapping from network id -> value')
        errored = true
    }

    if (!errored) {
      ctx.constants().set(id, config)
    }
  }
}

export const processList = async (parentCtx, constants) => {
  return Promise.all(Object.keys(constants || {}).map(c => {
    return process(parentCtx, c, constants[c])
  }))
}
