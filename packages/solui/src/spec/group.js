import { _, promiseSerial } from '../utils'

import { processList as processInputs } from './inputs'
import { process as processPanel } from './panel'
import { extractChildById } from './specUtils'

export const processGroupInputs = async (parentCtx, id, config) => {
  const ctx = parentCtx.createChildContext(id)

  const inputs = _.get(config, 'inputs')

  await processInputs(ctx, inputs || {})
}

export const processGroupPanel = async (parentCtx, id, config, panelId) => {
  const ctx = parentCtx.createChildContext(id)

  const inputs = _.get(config, 'inputs')

  await processInputs(ctx, inputs)

  const panelConfig = extractChildById(_.get(config, 'panels', []), panelId)

  if (!panelConfig) {
    ctx.errors().add(ctx.id, `panel not found: ${panelId}`)
    return
  }

  await processPanel(ctx, panelId, panelConfig)
}

export const processGroup = async (parentCtx, id, config) => {
  const ctx = parentCtx.createChildContext(id)

  if (_.isEmpty(config)) {
    ctx.errors().add(ctx.id, `must not be empty`)
  }

  const { title, inputs, panels } = config

  // need title
  if (!title) {
    ctx.errors().add(ctx.id, `must have a title`)
  }

  await ctx.callbacks().startGroup(id, config)

  await processInputs(ctx, inputs || {})

  if (_.isEmpty(panels)) {
    ctx.errors().add(ctx.id, `must have alteast 1 panel`)
  } else {
    const existingPanels = {}

    await promiseSerial(panels, async panelConfig => {
      const panelId = _.get(panelConfig, 'id')

      if (!panelId) {
        ctx.errors().add(ctx.id, `panel is missing id`)
      } else if (existingPanels[panelId]) {
        ctx.errors().add(ctx.id, `duplicate panel id: ${panelId}`)
      } else {
        existingPanels[panelId] = true
        await processPanel(ctx, panelId, panelConfig)
      }
    })
  }

  await ctx.callbacks().endGroup(id, config)
}
