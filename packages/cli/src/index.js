import webpack from 'webpack'
import WebpackDevServer from 'webpack-dev-server'
import VirtualModulesPlugin from 'webpack-virtual-modules'
import { assertSpecValid } from '@solui/processor'

import { DIST_FOLDER, createConfig } from './webpack.config'


export class Generator {
  constructor ({ port, artifacts, spec, debug }) {
    this.debug = debug
    this.port = parseInt(port || '3001', 10)
    this.artifacts = artifacts
    this.spec = spec
  }

  async start () {
    this.virtualModules = new VirtualModulesPlugin({
      'node_modules/artifacts.json': JSON.stringify(this.artifacts),
      'node_modules/spec.json': JSON.stringify(this.spec),
    })

    const config = createConfig({ virtualModules: this.virtualModules })

    const webpackCompiler = webpack(config)

    const compilationPromise = new Promise((resolve, reject) => {
      webpackCompiler.hooks.done.tap('done', stats => {
        try {
          if (stats.hasErrors()) {
            reject(new Error(stats.toString({ chunks: false, colors: true })))
          } else {
            resolve()
          }
        } catch (err) {
          reject(err)
        }
      })
    })

    const webpackDevServerOptions = {
      contentBase: DIST_FOLDER,
      compress: true,
      hot: true,
      host: '0.0.0.0',
      stats: this.debug ? 'normal' : 'errors-only',
    }

    WebpackDevServer.addDevServerEntrypoints(config, webpackDevServerOptions)

    this.server = new WebpackDevServer(webpackCompiler, webpackDevServerOptions)

    await new Promise((resolve, reject) => {
      this.server.listen(this.port, '0.0.0.0', err => {
        if (err) {
          reject(err)
        } else {
          resolve()
        }
      })
    })

    await compilationPromise
  }

  updateSpec (newSpec) {
    this.spec = newSpec
    this.virtualModules.writeModule('node_modules/spec.json', JSON.stringify(this.spec))
  }

  updateArtifacts (newArtifacts) {
    this.artifacts = newArtifacts
    this.virtualModules.writeModule('node_modules/artifacts.json', JSON.stringify(this.artifacts))
  }

  getEndpoint () {
    return `http://0.0.0.0:${this.port}`
  }
}

export const startGenerator = async cfg => {
  await assertSpecValid(cfg)

  const g = new Generator(cfg)
  await g.start()

  return g
}
