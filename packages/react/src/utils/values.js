import { _, toDecimalVal, deriveDecimalVal } from '@solui/utils'

/**
 * Get meta string to display to user based on input's value and configuration.
 *
 * @param  {String} type             Input type
 * @param  {*} value            Input current value
 * @param  {Object} config  Input configuration
 *
 * @return {InputMeta}
 */
export const getMetaTextForInput = ({ type, value, config }) => {
  const tips = []
  let metaText

  switch (type) {
    case 'int': {
      const unit = _.get(config, 'unit')
      const scale = _.get(config, 'scale')

      if (unit) {
        tips.push(`Unit: ${unit}`)
      }

      if (scale) {
        const realVal = deriveDecimalVal(value, { scale })
        metaText = `Real value: ${realVal ? realVal.toString(10) : ''}`
      }

      break
    }
    default:
      // do nothing
  }

  return { metaText, tips }
}


/**
 * Get renderable values for given output value and config.
 *
 * @param  {String} type             Output type
 * @param  {*} value            Output current value
 * @param  {Object} config  Output configuration
 *
 * @return [String]
 */
export const getRenderableValuesForOutput = ({ type, value, config }) => {
  // if value is a big number then convert to a base-10 string
  if (value && value._hex) {
    value = toDecimalVal(value).toString(10)
  }

  switch (type) {
    case 'bool':
      return [ value ? 'TRUE' : 'FALSE' ]
    case 'int':
      const v = []

      const unit = _.get(config, 'unit')
      const scale = _.get(config, 'scale')

      if (scale) {
        const realNum = deriveDecimalVal(value, config)
        v.push(`${realNum}${unit ? ` ${unit}` : ''}`)
      }

      v.push(value)

      return v
    default:
      return [ value ]
  }
}


/**
 * @typedef {Object} InputMeta
 * @property {String} metaText User-friendly help display string.
 * @property {Array} tips User-friendly input tips.
 */
