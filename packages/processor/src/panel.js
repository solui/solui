import { _ } from '@solui/utils'

import { processList as processInputs } from './inputs'
import { processList as processExecs } from './execs'
import { process as processOutput } from './output'

export const process = async (parentCtx, id, config) => {
  const ctx = parentCtx.createChildContext(`panel[${id}]`)

  if (_.isEmpty(config)) {
    ctx.errors().add(ctx.id, `must not be empty`)
  }

  const { title, inputs, execs, output } = config

  if (!title) {
    ctx.errors().add(ctx.id, `must have a title`)
  }

  await ctx.callbacks().startPanel(id, config)

  await processInputs(ctx, inputs)

  if (!(execs || [])[0]) {
    ctx.errors().add(ctx.id, `must have atleast 1 execution step`)
  }

  await processExecs(ctx, execs)

  await processOutput(ctx, output)

  await ctx.callbacks().endPanel(id)
}
