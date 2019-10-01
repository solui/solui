import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import {
  Button,
  Query,
  ErrorBox,
  NetworkContext,
} from '@solui/react-components'
import { _, getNetworkInfoFromGlobalScope } from '@solui/utils'
import { GetPackageQuery, GetVersionQuery } from '@solui/graphql'

import { PkgLink } from '../_components/Link'
import RenderDapp from '../_components/RenderDapp'
import Layout from '../_components/Layout'

const HomePage = () => {
  const [ network, setNetwork ] = useState(null)
  const router = useRouter()
  const { pkg: pkgName, vid } = router.query

  useEffect(() => {
    (async () => {
      try {
        const n = await getNetworkInfoFromGlobalScope()
        if (n && _.get(n, 'id') !== _.get(network, 'id')) {
          setNetwork(n)
        }
      } catch (err) {
        console.error(err)
        setNetwork(null)
      }
    })()
  }, [ network ])

  return (
    <Layout>
      <Query
        query={GetPackageQuery}
        variables={{ name: pkgName }}
        fetch-policy='cache-and-network'
      >
        {({ data: { result: pkg } }) => (
          pkg ? (
            <Query
              query={GetVersionQuery}
              variables={{ id: vid }}
              fetch-policy='cache-and-network'
            >
              {({ data: { result: version } }) => (
                version ? (
                  <NetworkContext.Provider value={{ network }}>
                    <RenderDapp pkg={pkg} version={version} />
                  </NetworkContext.Provider>
                ) : (
                  <>
                    <ErrorBox error={`Version "${vid}" not found for package "${pkgName}"!`} />
                    <PkgLink pkg={pkgName}>
                      <Button>View package</Button>
                    </PkgLink>
                  </>
                )
              )}
            </Query>
          ) : (
            <ErrorBox error={`Package "${pkgName}" not found!`} />
          )
        )}
      </Query>
    </Layout>
  )
}

export default HomePage
