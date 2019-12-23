import { font } from './fonts'
import one from './themes/1'

const themes = [ one ]

/**
 * Get a theme.
 * @param  {Number} [s] Theme number (default is latest version theme).
 * @return {Object} Theme object.
 */
export const getTheme = (s = themes.length - 1) => {
  if (!themes[s]) {
    s = themes.length - 1
  }

  return {
    ...themes[s],
    font,
  }
}


/**
 * Get number of themes.
 * @return {Number}
 */
export const getNumThemes = () => themes.length
