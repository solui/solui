import validator from 'validator'
import { isAddress } from '@ethersproject/address'

export const isEthereumAddress = isAddress

/**
 * Check if given value represents a valid email address.
 *
 * @param  {String}  val Input email address.
 * @return {Boolean|null} `true` if valid, `false` if not, `null` if input is empty.
 */
export const isEmail = val => {
  if (!val) {
    return null
  } else {
    return validator.isEmail(val)
  }
}
