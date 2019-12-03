import gql from 'graphql-tag'

import { PackageFragment, PackageResultFragment, VersionFragment } from './fragments'

/**
 * Get package version.
 * @type {Query}
 */
export const GetVersionQuery = gql`
  ${VersionFragment}

  query getVersion ($id: String!) {
    result: getVersion(id: $id) @disableAuth {
      ...VersionFragment
    }
  }
`

/**
 * Get package.
 * @type {Query}
 */
export const GetPackageQuery = gql`
  ${PackageFragment}

  query getPackage ($id: String!) {
    result: getPackage(id: $id) @disableAuth {
      ...PackageFragment
    }
  }
`

/**
 * Get authentication token.
 * @type {Query}
 */
export const GetAuthTokenQuery = gql`
  query getAuthToken ($loginToken: String!) {
    authToken: getAuthToken(loginToken: $loginToken) @disableAuth {
      token
      expires
    }
  }
`

/**
 * Search package list.
 * @type {Query}
 */
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
