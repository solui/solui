// NOTE: react-hot-loader import has to come before react and react-dom
import { hot } from 'react-hot-loader/root'
import React from 'react'
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable import/no-unresolved */
// wepback will alias this to @hot-loader/react-dom
import ReactDOM from 'react-dom'
// these modules will be dynamically generated using webpack
import spec from './spec.json'
import artifacts from './artifacts.json'
/* eslint-enable import/no-unresolved */
/* eslint-enable import/no-extraneous-dependencies */

import { AppContainer } from '@solui/react'
import {
  process as processSpec,
  assertSpecValid as validateSpec,
  validatePanel,
  executePanel,
} from '@solui/processor'

class App extends AppContainer {
  render () {
    return this._render({
      error: this.state.renderingError,
      network: this.state.network,
    }, {
      spec,
      artifacts,
      processSpec,
      validateSpec,
      validatePanel,
      executePanel,
      embedUrl: 'https://gateway.temporal.cloud/ipns/ui.solui.dev/#l=QmZ4sPfUQXYfh9WyTguLPuAnNGkhfhqT8BZ54Eseu5pfS6&shortEmbedUrl=http%3A%2F%2Flocalhost%3A3002%2Fui%2FQmZ4sPfUQXYfh9WyTguLPuAnNGkhfhqT8BZ54Eseu5pfS6'
    })
  }
}

const HotReloadingApp = hot(App)

ReactDOM.render(<HotReloadingApp />, document.getElementById('main'))
