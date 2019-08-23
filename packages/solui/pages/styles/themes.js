const themes = [
  'default',
].reduce((m, s) => {
  // eslint-disable-next-line import/no-dynamic-require
  m[s] = require(`./themes/${s}`).default
  return m
}, {})

export const getTheme = (s = 'default') => ({
  ...themes[s],
})
