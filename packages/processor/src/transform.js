import {
  _,
  prettyDate,
  deriveDecimalVal,
} from '@solui/utils'

const intToDecimal = (value, scale = 1) => {
  const d = deriveDecimalVal(value, { scale })
  if (!d) {
    throw new Error('invalid value')
  }
  return d
}

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
          value = intToDecimal(value, parseInt(t.scale, 10)).toString()
          break
        }
        case 'intToHexString': {
          value = intToDecimal(value).toHex()
          break
        }
        case 'intToBinaryString': {
          value = intToDecimal(value).toBinary()
          break
        }
        case 'intToDateString': {
          const d = intToDecimal(value)
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
