/* eslint-disable no-nested-ternary, no-restricted-globals, no-undef */
export const GLOBAL_SCOPE = (typeof window !== 'undefined' ? window : (
  typeof global !== 'undefined' ? global : (
    typeof self !== 'undefined' ? self : {}
  )
))
/* eslint-enable no-nested-ternary, no-restricted-globals, no-undef */

export const openUrlInBrowser = url => {
  if (typeof window !== 'undefined') {
    window.open(url)
  }
}
