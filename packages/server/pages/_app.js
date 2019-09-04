import _ from 'lodash'
import App from 'next/app'
import { DefaultSeo } from 'next-seo'
import React from 'react'
import { ApolloProvider } from 'react-apollo'
import { ApolloProvider as ApolloHooksProvider } from 'react-apollo-hooks'

import { APP_STATE_KEYS } from '../common/appState'
import { client } from '../frontend/graphql'
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

  render () {
    const { Component, pageProps, appState } = this.props

    return (
      <GlobalProvider value={appState}>
        <ApolloProvider client={client}>
          <ApolloHooksProvider client={client}>

            <DefaultSeo
              title="solUI"
              description="Declarative UIs for smart contracts"
            />

            <Component appState={appState} {...pageProps} />

          </ApolloHooksProvider>
        </ApolloProvider>
      </GlobalProvider>
    )
  }
}
