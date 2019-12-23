/* eslint-disable-next-line import/no-extraneous-dependencies */
import React, { Component } from 'react'
import styled from '@emotion/styled'
import { ThemeProvider } from 'emotion-theming'
import { _, getNetworkInfoFromGlobalScope } from '@solui/utils'
import { loadFonts, getTheme } from '@solui/styles'

import Layout from './Layout'
import Progress from './Progress'
import ErrorBox from './ErrorBox'
import Dapp from './Dapp'
import GlobalStyles from './GlobalStyles'
import { NetworkContext } from './contexts'
import { ModalProvider } from './Modal'

const RenderingError = styled(ErrorBox)`
  margin: 1rem;
`

export default class AppContainer extends Component {
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

  _render (state, dappComponentProps) {
    const { loading, error, network } = state

    let content

    if (loading) {
      content = <Progress>Loading ...</Progress>
    } else if (error) {
      content = <RenderingError error={error} />
    } else {
      content = (
        <Layout>
          <Dapp
            network={network}
            {...dappComponentProps}
          />
        </Layout>
      )
    }

    const theme = _.get(dappComponentProps, 'spec.version', undefined)

    return (
      <NetworkContext.Provider value={{ network }}>
        <ThemeProvider theme={{ ...getTheme(theme), ...dappComponentProps.theme }}>
          <GlobalStyles />
          <ModalProvider>
            {content}
          </ModalProvider>
        </ThemeProvider>
      </NetworkContext.Provider>
    )
  }
}
