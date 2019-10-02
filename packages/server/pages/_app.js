import App from 'next/app'
import { DefaultSeo } from 'next-seo'
import React from 'react'
import { ApolloProvider } from 'react-apollo'
import { ApolloProvider as ApolloHooksProvider } from '@apollo/react-hooks'
import { _ } from '@solui/utils'
import { getTheme, loadFonts } from '@solui/styles'
import { createApolloClient } from '@solui/graphql'
import { GlobalStyles } from '@solui/react-components'
import { ThemeProvider } from 'emotion-theming'

// From https://github.com/FortAwesome/react-fontawesome/issues/134#issuecomment-471940596
import '@fortawesome/fontawesome-svg-core/styles.css'

import { version } from '../package.json'
import { APP_STATE_KEYS } from '../common/appState'
import { GlobalProvider, getClientSideAppState } from '../frontend/globalState'

export default class MyApp extends App {
  static async getInitialProps ({ Component, ctx }) {
    let pageProps = {}

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx)
    }

    const ret = { pageProps, appState: {} }

    APP_STATE_KEYS.forEach(k => {
      ret.appState[k] = _.get(ctx, `res.${k}`, getClientSideAppState(k))
    })

    return ret
  }

  componentDidMount () {
    // if client-side then load custom fonts
    if (typeof window !== 'undefined' && !!window.document) {
      loadFonts({
        body: {
          name: 'Roboto',
          weights: {
            thin: 100,
            regular: 400,
            bold: 700,
          },
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

  render () {
    const { Component, pageProps, appState } = this.props

    if (!this._apolloClient) {
      this._apolloClient = createApolloClient({
        serverHost: appState.baseUrl,
        name: 'solui-server',
        version,
      })
    }

    return (
      <GlobalProvider value={appState}>
        <ApolloProvider client={this._apolloClient}>
          <ApolloHooksProvider client={this._apolloClient}>
            <ThemeProvider theme={getTheme()}>
              <DefaultSeo
                title="solUI"
                description="Declarative UIs for smart contracts"
              />
              <GlobalStyles />
              <Component appState={appState} {...pageProps} />
            </ThemeProvider>
          </ApolloHooksProvider>
        </ApolloProvider>
      </GlobalProvider>
    )
  }
}
