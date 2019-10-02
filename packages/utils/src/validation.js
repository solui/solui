import { isAddress } from 'web3-utils'
import validator from 'validator'

export const isEmail = val => {
  if (!val) {
    return null
  } else {
    return validator.isEmail(val)
  }
}

export const isEthereumAddress = val => isAddress(val)
