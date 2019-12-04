import gql from 'graphql-tag'

import { PackageFragment, ReleaseFragment, UserProfileFragment, AuthTokenFragment } from './fragments'

/**
 * Get my packages.
 * @type {Query}
 */
export const GetMyPackagesQuery = gql`
  ${PackageFragment}

  query getMyPackages {
    result: getMyPackages {
      ...PackageFragment
    }
  }
`

/**
 * Get my package.
 * @type {Query}
 */
export const GetMyPackageQuery = gql`
  ${PackageFragment}

  query getMyPackage ($id: ID!) {
    result: getMyPackage(id: $id) {
      ...PackageFragment
    }
  }
`


/**
 * Get my package.
 * @type {Query}
 */
export const GetMyPackageReleasesQuery = gql`
  ${ReleaseFragment}

  query getMyPackageReleases ($id: ID!) {
    result: getMyPackageReleases(id: $id) {
      ...ReleaseFragment
    }
  }
`


/**
 * Get authentication token.
 * @type {Query}
 */
export const GetAuthTokenQuery = gql`
  ${AuthTokenFragment}

  query getAuthToken ($loginToken: String!) {
    authToken: getAuthToken(loginToken: $loginToken) {
      ...AuthTokenFragment
    }
  }
`

/**
 * Get my profile.
 * @type {Query}
 */
export const GetMyProfile = gql`
  ${UserProfileFragment}

  query GetMyProfile {
    me: getMyProfile @requireAuth {
      ...UserProfileFragment
    }
  }
`



/**
 * Get my profile without authentication (authentation will have to manually provided at call-time).
 * @type {Query}
 */
export const GetMyProfileWithoutAuth = gql`
  ${UserProfileFragment}

  query GetMyProfile {
    me: getMyProfile {
      ...UserProfileFragment
    }
  }
`
