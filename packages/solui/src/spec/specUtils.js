import { _ } from '../utils'

export const inputIsPresent = (ctx, key) => (
  Object.keys(_.get(ctx, 'inputs', {})).includes(key)
)
