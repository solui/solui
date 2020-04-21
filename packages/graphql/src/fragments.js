import gql from 'graphql-tag'

/**
 * Error.
 * @type {Fragment}
 */
export const ErrorFragment = gql`
  fragment ErrorFragment on Error {
    error {
      code
      message
    }
  }
`




/**
 * Auth token.
 * @type {Fragment}
 */
export const AuthTokenFragment = gql`
  fragment AuthTokenFragment on AuthToken {
    token
    expires
  }
`

/**
 * User.
 * @type {Fragment}
 */
export const UserFragment = gql`
  ${ErrorFragment}

  fragment UserFragment on User {
    id
    address
  }
`


/**
 * User profile.
 * @type {Fragment}
 */
export const UserProfileFragment = gql`
  ${UserFragment}
  ${ErrorFragment}

  fragment UserProfileFragment on ProfileResult {
    ...on User {
      ...UserFragment
    }
    ...on Error {
      ...ErrorFragment
    }
  }
`

/**
 * Login result.
 * @type {Fragment}
 */
export const LoginResultFragment = gql`
  ${AuthTokenFragment}
  ${ErrorFragment}

  fragment LoginResultFragment on LoginResult {
    ...on AuthToken {
      ...AuthTokenFragment
    }
    ...on Error {
      ...ErrorFragment
    }
  }
`



/**
 * Release.
 * @type {Fragment}
 */
export const ReleaseFragment = gql`
  ${UserFragment}

  fragment ReleaseFragment on Release {
    id
    publisher {
      ...UserFragment
    }
    cid
    title
    description
    created
    bytecodeHashes
    production
  }
`


/**
 * Auth token result.
 * @type {Fragment}
 */
export const AuthTokenResultFragment = gql`
  ${AuthTokenFragment}
  ${ErrorFragment}

  fragment AuthTokenResultFragment on AuthTokenResult {
    ...on AuthToken {
      ...AuthTokenFragment
    }
    ...on Error {
      ...ErrorFragment
    }
  }
`


/**
 * Release list.
 * @type {Fragment}
 */
export const ReleaseListFragment = gql`
  ${ReleaseFragment}

  fragment ReleaseListFragment on ReleaseList {
    releases {
      ...ReleaseFragment
    }
    page
    totalResults
    numPages
  }
`

/**
 * Release result.
 * @type {Fragment}
 */
export const ReleaseResultFragment = gql`
  ${ReleaseFragment}
  ${ErrorFragment}

  fragment ReleaseResultFragment on ReleaseResult {
    ...on Release {
      ...ReleaseFragment
    }
    ...on Error {
      ...ErrorFragment
    }
  }
`




/**
 * Release list result.
 * @type {Fragment}
 */
export const ReleaseListResultFragment = gql`
  ${ReleaseListFragment}
  ${ErrorFragment}

  fragment ReleaseListResultFragment on ReleaseListResult {
    ...on ReleaseList {
      ...ReleaseListFragment
    }
    ...on Error {
      ...ErrorFragment
    }
  }
`




/**
 * Publish finalization.
 * @type {Fragment}
 */
export const PublishFinalizeFragment = gql`
  fragment PublishFinalizeFragment on PublishFinalize {
    finalizeUrl
  }
`


/**
 * Publish success.
 * @type {Fragment}
 */
export const PublishSuccessFragment = gql`
  fragment PublishSuccessFragment on PublishSuccess {
    cid
    url
    shortUrl
  }
`



/**
 * Publish result.
 * @type {Fragment}
 */
export const PublishResultFragment = gql`
  ${PublishFinalizeFragment}
  ${PublishSuccessFragment}
  ${ErrorFragment}

  fragment PublishResultFragment on PublishResult {
    ...on PublishFinalize {
      ...PublishFinalizeFragment
    }
    ...on PublishSuccess {
      ...PublishSuccessFragment
    }
    ...on Error {
      ...ErrorFragment
    }
  }
`


/**
 * Publish-to-chain success.
 * @type {Fragment}
 */
export const PublishToChainSuccessFragment = gql`
  fragment PublishToChainSuccessFragment on PublishToChainSuccess {
    dappId
  }
`



/**
 * Publish-to-chain result.
 * @type {Fragment}
 */
export const PublishToChainResultFragment = gql`
  ${PublishToChainSuccessFragment}
  ${ErrorFragment}

  fragment PublishToChainResultFragment on PublishToChainResult {
    ...on PublishToChainSuccess {
      ...PublishToChainSuccessFragment
    }
    ...on Error {
      ...ErrorFragment
    }
  }
`



/**
 * DappChainInfo.
 * @type {Fragment}
 */
export const DappChainInfoFragment = gql`
  fragment DappChainInfoFragment on DappChainInfo {
    exists
    numContracts
    publisher
    date
  }
`



/**
 * DappChainInfoResult.
 * @type {Fragment}
 */
export const DappChainInfoResultFragment = gql`
  ${DappChainInfoFragment}
  ${ErrorFragment}

  fragment DappChainInfoResultFragment on DappChainInfoResult {
    ...on DappChainInfo {
      ...DappChainInfoFragment
    }
    ...on Error {
      ...ErrorFragment
    }
  }
`