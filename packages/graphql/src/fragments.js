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
 * Package release.
 * @type {Fragment}
 */
export const ReleaseFragment = gql`
  fragment ReleaseFragment on Release {
    id
    cid
    title
    description
    created
    bytecodeHashes
  }
`

/**
 * Package.
 * @type {Fragment}
 */
export const PackageFragment = gql`
  ${UserFragment}
  ${ReleaseFragment}

  fragment PackageFragment on Package {
    id
    name
    owner {
      ...UserFragment
    }
    created
    latestRelease {
      ...ReleaseFragment
    }
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
 * Package.
 * @type {Fragment}
 */
export const PackageListFragment = gql`
  ${PackageFragment}

  fragment PackageListFragment on PackageList {
    packages {
      ...PackageFragment
    }
  }
`


/**
 * Package result.
 * @type {Fragment}
 */
export const PackageResultFragment = gql`
  ${PackageFragment}
  ${ErrorFragment}

  fragment PackageResultFragment on PackageResult {
    ...on Package {
      ...PackageFragment
    }
    ...on Error {
      ...ErrorFragment
    }
  }
`




/**
 * Package result.
 * @type {Fragment}
 */
export const PackageListResultFragment = gql`
  ${PackageListFragment}
  ${ErrorFragment}

  fragment PackageListResultFragment on PackageListResult {
    ...on PackageList {
      ...PackageListFragment
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