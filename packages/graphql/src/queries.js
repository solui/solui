import gql from 'graphql-tag'

import {
  ReleaseResultFragment,
  ReleaseListResultFragment,
  UserProfileFragment,
  AuthTokenResultFragment,
  DappChainInfoResultFragment,
} from './fragments'

/**
 * Get my packages.
 * @type {Query}
 */
export const GetMyReleasesQuery = gql`
  ${ReleaseListResultFragment}

  query getMyReleases {
    result: getMyReleases @requireAuth {
      ...ReleaseListResultFragment
    }
  }
`

/**
 * Get a package.
 * @type {Query}
 */
export const GetReleaseQuery = gql`
  ${ReleaseResultFragment}

  query getRelease ($id: ID!) {
    result: getRelease(id: $id) {
      ...ReleaseResultFragment
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
