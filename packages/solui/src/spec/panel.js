import { _ } from '../utils'

import { processList as processInputs } from './inputs'
import { processList as processExecs } from './execs'
import { process as processOutput } from './output'

export const process = async (ctx, id, config) => {
  if (_.isEmpty(config)) {
    ctx.errors.add(`${id} must not be empty`)
  }

  const { title, inputs, execs, output } = config

  // need title
  if (!title) {
    ctx.errors.add(`${id} must have a title`)
  }

  await ctx.callbacks.startUi(id, config)

  ctx.panel = { ...config, id }
  ctx.parentId = id

  await processInputs(ctx, inputs || {})

  if (!(execs || [])[0]) {
    ctx.errors.add(`${id} must have atleast 1 execution step`)
  }

  await processExecs(ctx, execs)

  await processOutput(ctx, output)

  await ctx.callbacks.endUi(id, config)
}
