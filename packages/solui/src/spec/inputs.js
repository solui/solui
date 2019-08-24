import _ from '../utils/lodash'

const INPUTS = {
  address: true,
  uint: true,
  int: true,
  bool: true,
  string: true,
  bytes32: true,
}

export const parse = (ctx, inputs) => {
  // check inputs
  _.each(inputs, (inputConfig, inputId) => {
    const logPrefix = `${ctx.parentId}.${inputId}`

    if (!_.get(inputConfig, 'title')) {
      ctx.errors.push(`Input ${logPrefix} must have a title`)
    }

    if (!INPUTS[_.get(inputConfig, 'type')]) {
      ctx.errors.push(`Input ${logPrefix} must have a valid type: ${Object.keys(INPUTS).join(', ')}`)
    }

    ctx.processor.doInput(inputId, inputConfig)
  })
}
