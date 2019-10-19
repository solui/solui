import React, { useMemo } from 'react'
import { ApolloProvider } from 'react-apollo'
import { ApolloProvider as ApolloHooksProvider } from '@apollo/react-hooks'
import { createApolloClient } from '@solui/graphql'

import { version } from '../../package.json'
import { GlobalProvider } from '../globalState'
import Layout from './Layout'

const PageWrapper = ({ appState, children }) => {
  const apolloClient = useMemo(() => {
    return createApolloClient({
      endpoint: `${appState.BASE_URL}/api/graphql`,
      name: 'solui-server',
      version,
    })
  }, [ appState ])

  return (
    <GlobalProvider value={appState}>
      <ApolloProvider client={apolloClient}>
        <ApolloHooksProvider client={apolloClient}>
          <Layout>
            {children}
          </Layout>
        </ApolloHooksProvider>
      </ApolloProvider>
    </GlobalProvider>
  )
}

export default PageWrapper
