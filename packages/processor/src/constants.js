import { _ } from '@solui/utils'

import {
  checkIdIsValid,
} from './validate'

export const process = async (parentCtx, id, config) => {
  const ctx = parentCtx.createChildContext(`constant[${id}]`)

  checkIdIsValid(ctx, id)

  if (ctx.constants().has(id)) {
    ctx.errors().add(ctx.id, `duplicate definition`)
  } else {
    let errored = false

    switch (typeof config) {
      case 'string':
        config = {
          default: config
        }
        break
      case 'object':
        if (!Object.keys(config).includes('default')) {
          ctx.errors().add(ctx.id, 'must contain "default" key')
          errored = true
        } else {
          Object.keys(config).forEach(k => {
            if (typeof k !== 'string') {
              ctx.errors().add(ctx.id, 'must only contain string keys')
              errored = true
            } else if (typeof config[k] !== 'string') {
              ctx.errors().add(ctx.id, 'must only contain string values')
              errored = true
            }
          })
        }
        break
      default:
        ctx.errors().add(ctx.id, 'must either be a string or a mapping')
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
