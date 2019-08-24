import React from 'react'
import App, { Container } from 'next/app'
import Head from 'next/head'
import { ThemeProvider } from 'emotion-theming'
import { Global } from '@emotion/core'

import { _ } from '../src/utils'
import { GlobalContext } from './_global'
import { APP_STATE_KEYS } from '../src/constants'
import resetStyles from './styles/reset'
import baseStyles from './styles/base'
import { getTheme } from './styles/themes'
import { getNetwork } from './utils/network'

export default class MyApp extends App {
  static async getInitialProps ({ Component, ctx }) {
    let pageProps = {}

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx)
    }

    const ret = { pageProps, appState: {} }

    APP_STATE_KEYS.forEach(k => {
      ret.appState[k] = ctx.res[k]
    })

    return ret
  }

  state = {
    renderingError: null,
  }

  componentDidUpdate () {
    (async () => {
      try {
        const n = await getNetwork()
        if (n && _.get(n, 'id') !== _.get(this.state.network, 'id')) {
          this.setState({ network: n })
        }
      } catch (err) {
        console.warn(err)
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
    const { Component, pageProps, appState, ...otherProps } = this.props

    // on client window.APP_STATE will be used
    const finalAppState = appState || window.APP_STATE

    const { renderingError, network } = this.state

    return renderingError ? (
      <div>There was a rendering error (see Developer Console). Please reload the UI.</div>
    ) : (
      <Container>
        <Head>
          <title>solui</title>
          <Global styles={resetStyles}/>
          <Global styles={baseStyles}/>
          <script type="text/javascript" dangerouslySetInnerHTML={{
            __html: `
              window.APP_STATE = ${JSON.stringify(finalAppState, null, 2)};
            `
          }}></script>
        </Head>
        <GlobalContext.Provider value={{ network }}>
          <ThemeProvider theme={getTheme()}>
            <Component
              {...otherProps}
              {...pageProps}
              appState={finalAppState}
              network={network}
            />
          </ThemeProvider>
        </GlobalContext.Provider>
      </Container>
    )
  }
}
