import _ from '../utils/lodash'

import { parse as parsePanel } from './panel'

class DummyProcessor {
  processInput () {}
}

export const validate = ({ ui, artifacts }) => {
  const ctx = {
    artifacts,
    errors: [],
    processor: new DummyProcessor()
  }

  if (_.isEmpty(ui)) {
    ctx.errors.push('UI spec is empty.')
  } else {
    _.each(ui, (panelConfig, panelId) => {
      parsePanel(ctx, panelId, panelConfig)
    })
  }

  if (ctx.errors.length) {
    const e = new Error(`There were one or more validation errors. See details.`)
    e.details = ctx.errors
    throw e
  }
}
