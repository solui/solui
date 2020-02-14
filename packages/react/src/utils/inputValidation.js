import { _, deriveRealNumber } from '@solui/utils'

/**
 * Get help string to display to user based on input's value and validation configuration.
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
        const realVal = deriveRealNumber(value, { scale })
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
 * @typedef {Object} InputMeta
 * @property {String} metaText User-friendly help display string.
 * @property {Array} tips User-friendly input tips.
 */
