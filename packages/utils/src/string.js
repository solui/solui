import urlParse from 'url-parse'
import qs from 'qs'
import slug from 'slugify'
import validator from 'validator'

/**
 * Obfuscate given string.
 *
 * This replaces most characters in the string with the `*` character, and
 * intelligently handles email addresses such that their general structure
 * is left untouched.
 *
 * @example
 *
 * obfuscate('password') // p*******
 * obfuscate('test@me.com') // t***@m*.c**
 *
 * @param  {String} str Input
 * @return {String}
 */
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

/**
 * Slugify given string.
 *
 * Note that by default this concatenates a random suffix in each call in order to ensure
 * slugs are somewhat unique, and as such is not idempotent.
 *
 * @param  {String} str Input
 * @return {String}
 */
export const slugify = str => slug(str)

/**
 * Parse given query string.
 *
 * @param  {String} str Input
 * @return {Object}
 */
export const parseQueryString = str => qs.parse(str)


/**
 * Parse URL.
 *
 * @param  {String} str Input
 * @return {Object}
 */
export const parseUrl = str => urlParse(str)
