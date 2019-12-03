import { font } from './fonts'

import defaultTheme from './themes/default'

const themes = {
  default: defaultTheme,
}

/**
 * Get a theme.
 * @param  {String} [s='default'] Theme name
 * @return {Object} Theme object.
 */
export const getTheme = (s = 'default') => ({
  ...themes[s],
  font,
})
