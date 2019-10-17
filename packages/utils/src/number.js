import EthVal from 'ethval'

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
