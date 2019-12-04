import gql from 'graphql-tag'

import { AuthTokenFragment } from './fragments'

/**
 * Publish package.
 * @type {Mutation}
 */
export const PublishMutation = gql`
  mutation publish ($bundle: PublishInput!) {
    publish(bundle: $bundle) @requireAuth {
      __typename
      ... on PublishSuccess {
        id
        cid
      }
      ... on PublishError {
        error
      }
    }
  }
`

/**
 * Login user.
 * @type {Mutation}
 */
export const LoginMutation = gql`
  ${AuthTokenFragment}

  mutation login ($challenge: String!, $signature: String!, $loginToken: String!) {
    login(challenge: $challenge, signature: $signature, loginToken: $loginToken) @disableAuth {
      ...AuthTokenFragment
    }
  }
`
