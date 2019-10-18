import slug from 'slug'
import { sha3 } from 'web3-utils'
import validator from 'validator'

export const obfuscate = str => {
  if (validator.isEmail(str)) {
    const [ name, at ] = str.split('@')
    const domain = at.split('.')
    return `${obfuscate(name)}@${domain.map(obfuscate).join('.')}`
  } else {
    const strLen = str.length
    if (1 < strLen) {
      return str.charAt(0) + '*'.repeat(strLen - 1)
    } else {
      return '*'
    }
  }
}

export const slugify = str => slug(`${str} ${Math.random().toString(36).substr(2, 6)}`)

export const hash = data => sha3(typeof data !== 'string' ? JSON.stringify(data) : data).substr(2)
