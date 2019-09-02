import { _, promiseSerial } from '../utils'

import { processList as processInputs } from './inputs'
import { process as processPanel } from './panel'
import { extractChildById, checkImageIsValid } from './specUtils'

export const processGroupInputs = async (rootCtx, id, config) => {
  const ctx = rootCtx.createGroupContext(id)

  await processInputs(ctx, _.get(config, 'inputs'))
}

export const processGroupPanel = async (rootCtx, id, config, panelId) => {
  const ctx = rootCtx.createGroupContext(id)

  await processInputs(ctx, _.get(config, 'inputs'))

  const panelConfig = extractChildById(_.get(config, 'panels', []), panelId)

  if (!panelConfig) {
    ctx.errors().add(ctx.id, `panel not found: ${panelId}`)
    return
  }

  await processPanel(ctx, panelId, panelConfig)
}

export const processGroup = async (rootCtx, id, config) => {
  const ctx = rootCtx.createGroupContext(id)

  if (_.isEmpty(config)) {
    ctx.errors().add(ctx.id, `must not be empty`)
  }

  const { title, description, image, inputs, panels } = config

  // need title
  if (!title) {
    ctx.errors().add(ctx.id, `must have a title`)
  }

  if (image) {
    await checkImageIsValid(ctx, image)
  }

  await ctx.callbacks().startGroup(id, { title, description, image })

  await processInputs(ctx, inputs)

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

  await ctx.callbacks().endGroup(id)
}
