// NOTE: react-hot-loader import has to come before react and react-dom
import { hot } from 'react-hot-loader/root'

/* eslint-disable import/no-unresolved */
// wepback will alias this @hot-loader/react-dom
import ReactDOM from 'react-dom'
// these modules will be dynamically generated using webpack
import spec from 'spec.json'
import artifacts from 'artifacts.json'
/* eslint-enable import/no-unresolved */

import React, { Component } from 'react'
import { ThemeProvider } from 'emotion-theming'
import { Global } from '@emotion/core'

import { _ } from '../utils'
import InterfaceRenderer from './renderer'
import { GlobalContext } from './_global'
import resetStyles from './styles/reset'
import baseStyles from './styles/base'
import { getTheme } from './styles/themes'
import { getNetwork } from './utils/network'

class App extends Component {
  state = {}

  componentDidUpdate () {
    (async () => {
      try {
        const n = await getNetwork()
        if (n && _.get(n, 'id') !== _.get(this.state.network, 'id')) {
          this.setState({ network: n })
        }
      } catch (err) {
        console.error(err)
        this.setState({ network: null })
      }
    })()
  }

  componentDidMount () {
    this.componentDidUpdate()
  }

  componentDidCatch (error, info) {
    console.error(error, info)
    this.setState({ renderingError: true })
  }

  render () {
    const { renderingError, network } = this.state

    return renderingError ? (
      <div>There was a rendering error (see Developer Console). Please reload the UI.</div>
    ) : (
      <>
        <Global styles={resetStyles}/>
        <Global styles={baseStyles}/>
        <GlobalContext.Provider value={{ network }}>
          <ThemeProvider theme={getTheme()}>
            <InterfaceRenderer appState={{ artifacts, spec }} network={network} />
          </ThemeProvider>
        </GlobalContext.Provider>
      </>
    )
  }
}

const HotReloadingApp = hot(App)

ReactDOM.render(<HotReloadingApp />, document.getElementById('main'))
