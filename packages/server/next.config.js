const withImages = require('next-images')
const withCss = require('@zeit/next-css')

// From https://github.com/zeit/next-plugins/issues/392#issuecomment-475845330
function hackRemoveMinimizeOptionFromCssLoaders (config) {
  console.warn(
    'HACK: Removing `minimize` option from `css-loader` entries in Webpack config',
  )
  config.module.rules.forEach(rule => {
    if (Array.isArray(rule.use)) {
      rule.use.forEach(u => {
        if (u.loader === 'css-loader' && u.options) {
          delete u.options.minimize
        }
      })
    }
  })
}

module.exports = withCss(withImages({
  webpack (config) {
    hackRemoveMinimizeOptionFromCssLoaders(config)
    return config
  }
}))
