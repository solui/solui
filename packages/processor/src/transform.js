import {
  _,
  prettyDate,
  deriveDecimalVal,
} from '@solui/utils'

export const transformValue = (ctx, value, transform = []) => {
  if (!_.get(transform, 'length')) {
    return undefined
  }

  transform.forEach(t => {
    try {
      switch (t.type) {
        case 'stringToSpacedSuffixedString': {
          value = `${value} ${t.suffix}`

          break
        }
        case 'intToScaledIntString': {
          const d = deriveDecimalVal(value, { scale: parseInt(t.scale, 10) })
          if (!d) {
            throw new Error('invalid value')
          }

          value = d.toString()

          break
        }
        case 'intToDateString': {
          const d = deriveDecimalVal(value)
          if (!d) {
            throw new Error('input value')
          }

          value = prettyDate(d.mul(1000).toNumber(), t.format || 'MMM d, yyyy')

          break
        }
        default:
          throw new Error(`invalid transform: ${t.type}`)
      }
    } catch (err) {
      ctx.recordError(`transform failed (${t.type}): ${err.message}`)
    }
  })

  return value
}
