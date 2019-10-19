import React from 'react'
import { useRouter } from 'next/router'
import {
  Button,
  Query,
  DateTime,
  ErrorBox,
} from '@solui/react-components'
import { GetPackageQuery, GetVersionQuery } from '@solui/graphql'

import { PkgVersionLink } from '../../frontend/components/Link'
import { getInitialPageProps } from '../../frontend/ssr'
import PageWrapper from '../../frontend/components/PageWrapper'

const PackagePage = props => {
  const router = useRouter()
  const { pkg: pkgId, vid } = router.query

  return (
    <PageWrapper {...props}>
      <Query
        query={GetPackageQuery}
        variables={{ id: pkgId }}
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
                  <p>Id: {pkgId}</p>
                  <p>Author: {pkg.author.username}</p>
                  {version ? (
                    <p>
                      Selected version: <DateTime dateTime={version.created} />
                      <PkgVersionLink pkg={pkgId} vid={version.id}>
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
            <ErrorBox error={`Package "${pkgId}" not found!`} />
          )
        )}
      </Query>
    </PageWrapper>
  )
}

PackagePage.getInitialProps = getInitialPageProps

export default PackagePage
