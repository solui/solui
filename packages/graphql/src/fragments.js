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


