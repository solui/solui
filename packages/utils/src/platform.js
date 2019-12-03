/* eslint-disable no-nested-ternary, no-restricted-globals, no-undef */
/**
 * Isomorphic, cross-platform global scope.
 *
 * @type {Object}
 */
export const GLOBAL_SCOPE = (typeof window !== 'undefined' ? window : (
  typeof global !== 'undefined' ? global : (
    typeof self !== 'undefined' ? self : {}
  )
))
/* eslint-enable no-nested-ternary, no-restricted-globals, no-undef */

/**
 * Alert user to message.
 *
 * @param  {String} msg the message
 * @return {void}
 */
export const alert = msg => {
  if (typeof window !== 'undefined') {
    alert(msg)
  }
  console.log(msg)
}

/**
 * Get query string value from current browser URL.
 *
 * @param  {String} key Querystring key to look for.
 * @return {String|null} Returns `null` if not found or not running in browser.
 */
export const getQueryString = key => {
  if (typeof window !== 'undefined' && window.document && window.URL) {
    const { searchParams } = new window.URL(window.document.location)
    return searchParams.get(key)
  }
  return null
}
