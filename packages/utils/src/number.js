import { Decimal } from 'decimal.js'

const PreciseDecimal = Decimal.clone({ defaults: true, toExpPos: 33 })

export const toDecimalVal = (a, scale = 0) => {
  try {
    if (a) {
      if (a._hex) {
        a = a._hex
      } else if (a._isBigNumber) {
        a = a.toString(10)
      }
    }

    const d = new PreciseDecimal(`${a}`)

    return scale ? d.mul(Decimal.pow(10, scale)) : d
  } catch (err) {
    return null
  }
}

export const deriveRealNumber = (value, { scale } = {}) => {
  return toDecimalVal(value, scale)
}
