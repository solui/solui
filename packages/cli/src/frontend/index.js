// NOTE: react-hot-loader import has to come before react and react-dom
import { hot } from 'react-hot-loader/root'

/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable import/no-unresolved */
// wepback will alias this @hot-loader/react-dom
import ReactDOM from 'react-dom'
// these modules will be dynamically generated using webpack
import spec from 'spec.json'
import artifacts from 'artifacts.json'
/* eslint-enable import/no-unresolved */
/* eslint-enable import/no-extraneous-dependencies */

// From https://github.com/FortAwesome/react-fontawesome/issues/134#issuecomment-471940596
import '@fortawesome/fontawesome-svg-core/styles.css'

import React, { Component } from 'react'
import styled from '@emotion/styled'
import { ThemeProvider } from 'emotion-theming'
import { _, getNetworkInfoFromGlobalScope } from '@solui/utils'
import { loadFonts, getTheme } from '@solui/styles'
import { NetworkContext, ErrorBox, GlobalStyles } from '@solui/react-components'

import InterfaceRenderer from './renderer'

const RenderingError = styled(ErrorBox)`
  margin: 1rem;
`

class App extends Component {
  state = {}

  componentDidUpdate () {
    (async () => {
      try {
        const n = await getNetworkInfoFromGlobalScope()
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

    // if client-side then load custom fonts
    if (typeof window !== 'undefined' && !!window.document) {
      loadFonts({
        body: {
          name: 'Roboto',
          weights: {
            thin: 100,
            regular: 400,
            bold: 700,
          }
        },
        header: {
          name: 'Open Sans',
          weights: {
            regular: 400,
            bold: 700,
          }
        }
      }, window.document).then(
        () => this.forceUpdate(),
        err => console.error(err)
      )
    }
  }

  componentDidCatch (error, info) {
    console.error(error, info)
    this.setState({ renderingError: true })
  }

  render () {
    const { renderingError, network } = this.state

    return (
      <NetworkContext.Provider value={{ network }}>
        <ThemeProvider theme={getTheme()}>
          <GlobalStyles />
          {renderingError ? (
            <RenderingError error='There was a rendering error (see Developer Console). Please reload the UI.' />
          ) : (
            <InterfaceRenderer appState={{ artifacts, spec }} network={network} />
          )}
        </ThemeProvider>
      </NetworkContext.Provider>
    )
  }
}

const HotReloadingApp = hot(App)

ReactDOM.render(<HotReloadingApp />, document.getElementById('main'))
