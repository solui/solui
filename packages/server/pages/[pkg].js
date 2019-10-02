import React from 'react'
import { useRouter } from 'next/router'
import {
  Button,
  Query,
  DateTime,
  ErrorBox,
} from '@solui/react-components'
import { GetPackageQuery, GetVersionQuery } from '@solui/graphql'

import { PkgVersionLink } from '../frontend/components/Link'
import Layout from '../frontend/components/Layout'

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
              variables={{ id: vid || pkg.latestVersion.id }}
              fetch-policy='cache-and-network'
            >
              {({ data: { result: version } }) => (
                <div>
                  <p>Name: {pkgName}</p>
                  <p>Author: {pkg.author.username}</p>
                  {version ? (
                    <p>
                      Selected version: <DateTime dateTime={version.created} />
                      <PkgVersionLink pkg={pkgName} vid={version.id}>
                        <Button>Use it</Button>
                      </PkgVersionLink>
                    </p>
                  ) : null}
                  <p />
                  <p>Latest version: <DateTime dateTime={pkg.latestVersion.created} /></p>
                </div>
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
