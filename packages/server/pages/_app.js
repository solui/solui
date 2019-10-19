import App from 'next/app'
import { DefaultSeo } from 'next-seo'
import React from 'react'
import { getTheme, loadFonts } from '@solui/styles'
import { GlobalStyles } from '@solui/react-components'
import { ThemeProvider } from 'emotion-theming'

// From https://github.com/FortAwesome/react-fontawesome/issues/134#issuecomment-471940596
import '@fortawesome/fontawesome-svg-core/styles.css'

export default class MyApp extends App {
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
    const { Component, pageProps } = this.props

    return (
      <ThemeProvider theme={getTheme()}>
        <DefaultSeo
          title="solUI"
          description="Declarative UIs for smart contracts"
        />
        <GlobalStyles />
        <Component {...pageProps} />
      </ThemeProvider>
    )
  }
}
