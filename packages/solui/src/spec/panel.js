import _ from '../utils/lodash'

import { process as processInputs } from './inputs'
import { process as processExecs } from './execs'

export const process = async (ctx, id, config) => {
  // need title
  if (!_.get(config, 'title')) {
    ctx.errors.push(`${id} must have a title`)
  }

  await ctx.processor.startUi(id, config)

  ctx.panel = { ...config, id }
  ctx.parentId = id

  await processInputs(ctx, _.get(config, 'inputs', {}))

  if (!_.get(config, 'execs.0')) {
    ctx.errors.push(`${id} must have atleast 1 execution step`)
  }

  await processExecs(ctx, _.get(config, 'execs', {}))

  await ctx.processor.endUi(id, config)
}
