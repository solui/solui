import gql from 'graphql-tag'

import {
  PackageResultFragment,
  PackageListResultFragment,
  UserProfileFragment,
  AuthTokenResultFragment,
  DappChainInfoResultFragment,
} from './fragments'

/**
 * Get my packages.
 * @type {Query}
 */
export const GetMyPackagesQuery = gql`
  ${PackageListResultFragment}

  query getMyPackages {
    result: getMyPackages @requireAuth {
      ...PackageListResultFragment
    }
  }
`

/**
 * Get a package.
 * @type {Query}
 */
export const GetPackageQuery = gql`
  ${PackageResultFragment}

  query getPackage ($id: ID!) {
    result: getPackage(id: $id) {
      ...PackageResultFragment
    }
  }
`


/**
 * Get a release.
 * @type {Query}
 */
export const GetPackageByReleaseQuery = gql`
  ${PackageResultFragment}

  query getPackageByRelease ($id: ID!) {
    result: getPackageByRelease(id: $id) {
      ...PackageResultFragment
    }
  }
`


/**
 * Get authentication token.
 * @type {Query}
 */
export const GetAuthTokenQuery = gql`
  ${AuthTokenResultFragment}

  query getAuthToken ($loginToken: String!) {
    result: getAuthToken(loginToken: $loginToken) {
      ...AuthTokenResultFragment
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



/**
 * Get dapp info from on-chain repo.
 * @type {Query}
 */
export const GetDappInfoFromChain = gql`
  ${DappChainInfoResultFragment}

  query GetDappInfoFromChain ($dappId: String!) @client {
    result: getDappInfoFromChain(dappId: $dappId) @client {
      ...DappChainInfoResultFragment
    }
  }
`
