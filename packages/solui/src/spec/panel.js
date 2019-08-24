import _ from '../utils/lodash'

import { parse as parseInputs } from './inputs'
import { parse as parseExecs } from './execs'

export const parse = (ctx, id, config) => {
  // need title
  if (!_.get(config, 'title')) {
    ctx.errors.push(`${id} must have a title`)
  }

  ctx.processor.startPanel(id, config)

  ctx.panel = { ...config, id }
  ctx.parentId = id

  parseInputs(ctx, _.get(config, 'inputs', {}))
  parseExecs(ctx, _.get(config, 'execute', []))

  ctx.processor.endPanel(id, config)
}
