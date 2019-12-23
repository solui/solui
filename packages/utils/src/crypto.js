import { hashMessage } from '@ethersproject/hash'
import { recoverAddress } from '@ethersproject/transactions'
import { toUtf8Bytes } from '@ethersproject/strings'
import { keccak256 } from '@ethersproject/keccak256'

/**
 * Get account which signed given string to obtain given signature.
 *
 * @param  {String} str The input string.
 * @param  {String} signature The flat-format signature.
 * @return {String} Ethereum address.
 */
export const recoverSigningAccount = (str, signature) => {
  return recoverAddress(hashMessage(str), signature)
}

/**
 * Calculate Keccak256 hash of given data.
 *
 * @param  {*} data Input data. If not a `String` it will transform it via `JSON.stringify()` first.
 * @return {String} Hex hash with the `0x` prefix.
 */
export const hash = data => {
  const str = typeof data !== 'string' ? JSON.stringify(data) : data
  const bytes = toUtf8Bytes(str)
  return keccak256(bytes)
}
