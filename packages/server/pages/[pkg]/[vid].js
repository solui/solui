import React from 'react'
import { useRouter } from 'next/router'
import {
  Button,
  Query,
  ErrorBox,
} from '@solui/react-components'
import { GetPackageQuery, GetVersionQuery } from '@solui/graphql'

import { PkgLink } from '../../frontend/components/Link'
import RenderDapp from '../../frontend/components/RenderDapp'
import Layout from '../../frontend/components/Layout'

const HomePage = () => {
  const router = useRouter()
  const { pkg: pkgName, vid } = router.query

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
                  <RenderDapp pkg={pkg} version={version} />
                ) : (
                  <div>
                    <ErrorBox error={`Version "${vid}" not found for package "${pkgName}"!`} />
                    <PkgLink pkg={pkgName}>
                      <Button>View package</Button>
                    </PkgLink>
                  </div>
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
