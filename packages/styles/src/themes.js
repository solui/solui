import defaultTheme from './themes/default'

const themes = {
  default: defaultTheme,
}

export const getTheme = (s = 'default') => ({
  ...themes[s],
})
