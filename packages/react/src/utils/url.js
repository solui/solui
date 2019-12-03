/**
 * Navigate to given URL in platform-agnostic manner.
 *
 * This does nothing server-side.
 *
 * @param  {String}  url URL to navigate to.
 *
 * @return {undefined}
 */
export const openUrl = url => {
  if (typeof window !== 'undefined') {
    window.open(url)
  }
}
