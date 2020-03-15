import { _ } from '@solui/utils'

import { processList as processInputs } from './inputs'
import { processList as processExecs } from './execs'
import { processList as processOutputs } from './outputs'
import { createPanelContextFrom } from './context'
import {
  checkIdIsValid,
  checkTitleIsValid,
} from './validate'

export const process = async (parentCtx, id, config) => {
  const ctx = createPanelContextFrom(parentCtx, `panel[${id}]`)

  checkIdIsValid(ctx, id)

  if (_.isEmpty(config)) {
    ctx.recordError(`must not be empty`)
  }

  const { title, inputs, execs, outputs } = config

  checkTitleIsValid(ctx, title)

  await ctx.callbacks().startPanel(id, config)

  await processInputs(ctx, inputs)

  if (!(execs || [])[0]) {
    ctx.recordError(`must have at least 1 execution step`)
  }

  await processExecs(ctx, execs)

  await processOutputs(ctx, outputs)

  await ctx.callbacks().endPanel(id)
}
