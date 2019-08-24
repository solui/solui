import _ from '../utils/lodash'

import { parse as parsePanel } from './panel'

export const assertSpecValidity = ({ ui, artifacts }) => {
  const ctx = {
    artifacts,
    errors: [],
    processor: {
      startPanel: () => {},
      endPanel: () => {},
      doInput: () => {},
      doExecStep: () => {},
    }
  }

  if (_.isEmpty(ui)) {
    ctx.errors.push('UI spec is empty.')
  } else {
    _.each(ui, (config, id) => {
      parsePanel(ctx, id, config)
    })
  }

  if (ctx.errors.length) {
    const e = new Error(`There were one or more validation errors. See details.`)
    e.details = ctx.errors
    throw e
  }
}

export const parse = ({ ui, artifacts }, processor) => {
  const ctx = {
    artifacts,
    errors: [],
    processor,
  }

  if (_.isEmpty(ui)) {
    ctx.errors.push('UI spec is empty.')
  } else {
    _.each(ui, (config, id) => {
      parsePanel(ctx, id, config)
    })
  }

  return ctx.errors
}
