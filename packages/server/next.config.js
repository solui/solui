const withImages = require('next-images')
const withCss = require('@zeit/next-css')

module.exports = withCss(withImages({
  webpack (config) {
    return config
  }
}))
