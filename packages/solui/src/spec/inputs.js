import { isAddress } from 'web3-utils'

import _ from '../utils/lodash'

const INPUTS = {
  address: true,
  uint: true,
  int: true,
  bool: true,
  string: true,
  bytes32: true,
}

export const process = async (ctx, inputs) => (
  Promise.all(_.map(inputs, async (inputId, inputConfig) => {
    const newCtx = { ...ctx, id: `${ctx.parentId}.${inputId}` }

    if (!_.get(inputConfig, 'title')) {
      ctx.errors.push(`Input ${newCtx.id} must have a title`)
    }

    const type = _.get(inputConfig, 'type')
    if (!INPUTS[type]) {
      ctx.errors.push(`Input ${newCtx.id} must have a valid type: ${Object.keys(INPUTS).join(', ')}`)
    }

    const initialValue = _.get(inputConfig, 'initialValue')
    if (initialValue) {
      switch (type) {
        case 'address': {
          if (!isAddress(initialValue)) {
            ctx.errors.push(`Input ${newCtx.id} initial value must be a valid Ethereum address`)
          }
          break
        }
        default:
          // do nothing
      }
    }

    ctx.inputs[inputId] = await ctx.processor.getInput(newCtx.id, inputConfig)
  }))
)
