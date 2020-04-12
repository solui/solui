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



/**
 * Check if given value represents a bytes32 string.
 *
 * @param  {String}  val Input.
 * @return {Boolean|null} `true` if valid, `false` if not, `null` if input is empty.
 */
export const isBytes32 = val => {
  if (!val || typeof val !== 'string' || !val.match(/^0x[A-Za-z0-9]{64}$/)) {
    return false
  } else {
    return true
  }
}
