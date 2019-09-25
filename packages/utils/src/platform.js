/* eslint-disable no-nested-ternary, no-restricted-globals, no-undef */
export const GLOBAL_SCOPE = (typeof window !== 'undefined' ? window : (
  typeof global !== 'undefined' ? global : (
    typeof self !== 'undefined' ? self : {}
  )
))
/* eslint-enable no-nested-ternary, no-restricted-globals, no-undef */

export const alert = msg => {
  if (typeof window !== 'undefined') {
    alert(msg)
  }
  console.log(msg)
}

export const getQueryString = key => {
  if (typeof window !== 'undefined' && window.document && window.URL) {
    const { searchParams } = new window.URL(window.document.location)
    return searchParams.get(key)
  }
  return null
}
