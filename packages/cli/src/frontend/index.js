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

import React, { Component } from 'react'
import styled from '@emotion/styled'
import { ThemeProvider } from 'emotion-theming'
import { Global } from '@emotion/core'
import { _, getNetwork } from '@solui/utils'
import { resetStyles, baseStyles, getTheme } from '@solui/styles'

import ErrorBox from './components/ErrorBox'
import InterfaceRenderer from './renderer'
import { GlobalContext } from './_global'

const RenderingError = styled(ErrorBox)`
  margin: 1rem;
`

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

    return (
      <>
        <Global styles={resetStyles}/>
        <Global styles={baseStyles}/>
        <GlobalContext.Provider value={{ network }}>
          <ThemeProvider theme={getTheme()}>
            {renderingError ? (
              <RenderingError error='There was a rendering error (see Developer Console). Please reload the UI.' />
            ) : (
              <InterfaceRenderer appState={{ artifacts, spec }} network={network} />
            )}
          </ThemeProvider>
        </GlobalContext.Provider>
      </>
    )
  }
}

const HotReloadingApp = hot(App)

ReactDOM.render(<HotReloadingApp />, document.getElementById('main'))
