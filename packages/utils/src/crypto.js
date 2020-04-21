import { ethers } from 'ethers'

/**
 * Get account which signed given string to obtain given signature.
 *
 * @param  {String} str The input string.
 * @param  {String} signature The flat-format signature.
 * @return {String} Ethereum address.
 */
export const recoverSigningAccount = (str, signature) => {
  return ethers.utils.recoverAddress(ethers.utils.hashMessage(str), signature)
}

/**
 * Calculate Keccak256 hash of given data.
 *
 * @param  {*} data Input data. If not a `String` it will transform it via `JSON.stringify()` first.
 * @param {Boolean} omitPrefix If `true` then the the `0x` prefix will be omited from the final hash.
 * @param {Number} maxLen If set then truncate final output to given no. of characters.
 * @return {String} Hex hash with the `0x` prefix.
 */
export const hash = (data, { omitPrefix = false, maxLen = 0 } = {}) => {
  const str = typeof data !== 'string' ? JSON.stringify(data) : data
  const bytes = ethers.utils.toUtf8Bytes(str)
  const h = ethers.utils.keccak256(bytes)
  const prefixed = omitPrefix ? h.substr(2) : h
  return maxLen ? prefixed.substr(0, maxLen) : prefixed
}
