const themes = {
  default: require('./themes/default').default
}

export const getTheme = (s = 'default') => ({
  ...themes[s],
})
