import React from 'react'
import App, { Container } from 'next/app'
import Head from 'next/head'

export default class MyApp extends App {
  static async getInitialProps ({ Component, ctx }) {
    let pageProps = {}

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx)
    }

    const ret = { pageProps }

    return ret
  }

  render () {
    const { Component, pageProps, ...otherProps } = this.props

    return (
      <Container>
        <Head>
          <title>solui</title>
        </Head>
        <Component {...otherProps} {...pageProps} />
      </Container>
    )
  }
}
