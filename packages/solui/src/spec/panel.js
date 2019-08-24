import { _ } from '../utils'

import { processList as processInputs } from './inputs'
import { processList as processExecs } from './execs'
import { process as processOutput } from './output'

export const process = async (ctx, id, config) => {
  // need title
  if (!_.get(config, 'title')) {
    ctx.errors.add(`${id} must have a title`)
  }

  await ctx.callbacks.startUi(id, config)

  ctx.panel = { ...config, id }
  ctx.parentId = id

  await processInputs(ctx, _.get(config, 'inputs', {}))

  if (!_.get(config, 'execs.0')) {
    ctx.errors.add(`${id} must have atleast 1 execution step`)
  }

  await processExecs(ctx, _.get(config, 'execs', {}))

  await processOutput(ctx, _.get(config, 'output'))

  await ctx.callbacks.endUi(id, config)
}
