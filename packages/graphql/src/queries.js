import gql from 'graphql-tag'

import { PackageFragment, PackageResultFragment, VersionFragment } from './fragments'

export const GetVersionQuery = gql`
  ${VersionFragment}

  query getVersion ($id: ID!) {
    result: getVersion(id: $id) @disableAuth {
      ...VersionFragment
    }
  }
`

export const GetPackageQuery = gql`
  ${PackageFragment}

  query getPackage ($name: String!) {
    result: getPackage(name: $name) @disableAuth {
      ...PackageFragment
    }
  }
`

export const GetAuthTokenQuery = gql`
  query getAuthToken ($loginToken: String!) {
    authToken: getAuthToken(loginToken: $loginToken) @disableAuth {
      token
      expires
    }
  }
`

export const SearchQuery = gql`
  ${PackageResultFragment}

  query search ($criteria: SearchCritieraInput!) {
    search(criteria: $criteria) @disableAuth {
      packages {
        ...PackageResultFragment
      }
      page
      totalResults
      numPages
    }
  }
`
