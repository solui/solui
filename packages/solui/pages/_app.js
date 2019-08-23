import React from 'react'
import App, { Container } from 'next/app'
import Head from 'next/head'

import { APP_STATE_KEYS } from '../src/frontend'

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
          <script type="text/javascript" dangerouslySetInnerHTML={{
            __html: `
              window.APP_STATE = ${JSON.stringify(finalAppState, null, 2)};
            `
          }}></script>
        </Head>
        <Component {...otherProps} {...pageProps} appState={finalAppState} />
      </Container>
    )
  }
}
