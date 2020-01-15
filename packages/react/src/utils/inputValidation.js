import { _, deriveRealNumber } from '@solui/utils'

const allowedTypesToFriendlyNames = s => {
  switch (s) {
    case 'contract':
      return 'on-chain contract'
    case 'eoa':
      return 'externally-owned account'
    default:
      return 'Unknown'
  }
}

/**
 * Get help string to display to user based on input's value and validation configuration.
 *
 * @param  {String} type             Input type
 * @param  {*} value            Input current value
 * @param  {Object} config  Input configuration
 *
 * @return {InputHelp}
 */
export const getInputHelpBasedOnInputConfig = ({ type, value, config }) => {
  const tips = []
  let helpStr

  switch (type) {
    // case 'address': {
    //   const allowedTypes = _.get(config, 'allowedTypes', [])

    //   if (Array.isArray(allowedTypes) && allowedTypes.length) {
    //     tips.push(`Must be an Ethereum address.`)
    //     tips.push(`Allowed types: ${allowedTypes.map(allowedTypesToFriendlyNames).join(' OR ')}.`)
    //   }

    //   helpStr = `Length: ${value ? value.length : 0}`

    //   break
    // }
    // case 'string': {
    //   const minLen = parseInt(_.get(config, 'length.min'), 10)
    //   const maxLen = parseInt(_.get(config, 'length.max'), 10)

    //   if (!Number.isNaN(minLen) && !Number.isNaN(maxLen)) {
    //     tips.push(`Length: must be between ${minLen} and ${maxLen} characters.`)
    //   }

    //   helpStr = `Length: ${value ? value.length : 0}`

    //   break
    // }
    case 'int': {
      // const minVal = _.get(config, 'range.min')
      // const maxVal = _.get(config, 'range.max')
      // if (minVal && maxVal) {
      //   tips.push(`Value: must be between ${minVal} and ${maxVal}.`)
      // }
      const unit = _.get(config, 'unit')
      const scale = _.get(config, 'scale')

      if (unit) {
        tips.push(`Unit: ${unit}`)
      }

      if (scale) {
        const realVal = deriveRealNumber(value, { scale })
        helpStr = `Real value: ${realVal ? realVal.toString(10) : ''}`
      }

      break
    }
    default:
      // do nothing
  }

  return { helpStr, tips }
}


/**
 * @typedef {Object} InputHelp
 * @property {String} helpStr User-friendly help display string.
 * @property {Array} tips User-friendly input tips.
 */
