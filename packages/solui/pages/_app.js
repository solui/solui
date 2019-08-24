import React from 'react'
import App, { Container } from 'next/app'
import Head from 'next/head'
import { ThemeProvider } from 'emotion-theming'
import { Global } from '@emotion/core'

import { APP_STATE_KEYS } from '../src/constants'
import resetStyles from './styles/reset'
import baseStyles from './styles/base'
import { getTheme } from './styles/themes'

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

  render () {
    const { Component, pageProps, appState, ...otherProps } = this.props

    // on client window.APP_STATE will be used
    const finalAppState = appState || window.APP_STATE

    return (
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
        <ThemeProvider theme={getTheme()}>
          <Component {...otherProps} {...pageProps} appState={finalAppState} />
        </ThemeProvider>
      </Container>
    )
  }
}
