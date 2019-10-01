import gql from 'graphql-tag'

export const UserFragment = gql`
  fragment UserFragment on User {
    id
    username
  }
`

export const VersionFragment = gql`
  fragment VersionFragment on Version {
    id
    title
    description
    created
    data
  }
`

export const VersionCompactFragment = gql`
  fragment VersionCompactFragment on VersionCompact {
    id
    title
    description
    created
  }
`

export const PackageResultFragment = gql`
  ${UserFragment}
  ${VersionCompactFragment}

  fragment PackageResultFragment on PackageResult {
    id
    name
    author {
      ...UserFragment
    }
    created
    version {
      ...VersionCompactFragment
    }
  }
`

export const PackageFragment = gql`
  ${UserFragment}
  ${VersionCompactFragment}

  fragment PackageFragment on Package {
    id
    name
    author {
      ...UserFragment
    }
    created
    latestVersion {
      ...VersionCompactFragment
    }
  }
`
