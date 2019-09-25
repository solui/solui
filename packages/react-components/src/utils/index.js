export const openUrl = async url => {
  if (typeof window !== 'undefined') {
    window.open(url)
  }
}
