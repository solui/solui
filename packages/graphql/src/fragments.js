import gql from 'graphql-tag'

/**
 * User profile.
 * @type {Fragment}
 */
export const UserFragment = gql`
  fragment UserFragment on User {
    id
    username
  }
`

/**
 * Package version.
 * @type {Fragment}
 */
export const VersionFragment = gql`
  fragment VersionFragment on Version {
    id
    title
    description
    created
    data
  }
`

/**
 * Package version, compact mode.
 * @type {Fragment}
 */
export const VersionCompactFragment = gql`
  fragment VersionCompactFragment on VersionCompact {
    id
    title
    description
    created
  }
`

/**
 * Package search result.
 * @type {Fragment}
 */
export const PackageResultFragment = gql`
  ${UserFragment}
  ${VersionCompactFragment}

  fragment PackageResultFragment on PackageResult {
    id
    author {
      ...UserFragment
    }
    created
    version {
      ...VersionCompactFragment
    }
  }
`

/**
 * Package.
 * @type {Fragment}
 */export const PackageFragment = gql`
  ${UserFragment}
  ${VersionCompactFragment}

  fragment PackageFragment on Package {
    id
    author {
      ...UserFragment
    }
    created
    latestVersion {
      ...VersionCompactFragment
    }
  }
`
