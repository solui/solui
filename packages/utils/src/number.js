import EthVal from 'ethval'

/**
 * Convert input to  [EthVal](https://www.npmjs.com/package/ethval) representation
 *
 * @param  {String|Number|BN.js|EthVal} v Input value
 * @param  {String} [unit='wei'] Unit for input value.
 * @return {EthVal}
 */
export const toEthVal = (v, unit) => {
  try {
    switch ((unit || '').toLowerCase()) {
      case 'eth':
        return new EthVal(v, 'eth')
      case 'gwei':
        return new EthVal(v, 'gwei')
      case 'wei':
      default:
        return new EthVal(v, 'wei')
    }
  } catch (err) {
    return null
  }
}
