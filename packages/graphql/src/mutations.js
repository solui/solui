import gql from 'graphql-tag'

import { PublishResultFragment, LoginResultFragment } from './fragments'



/**
 * Publish package.
 * @type {Mutation}
 */
export const PublishMutation = gql`
  ${PublishResultFragment}

  mutation publish ($bundle: PublishInput!) {
    result: publish(bundle: $bundle) @requireAuth {
      ...PublishResultFragment
    }
  }
`

/**
 * Login user.
 * @type {Mutation}
 */
export const LoginMutation = gql`
  ${LoginResultFragment}

  mutation login ($challenge: String!, $signature: String!, $loginToken: String) {
    login(challenge: $challenge, signature: $signature, loginToken: $loginToken) @disableAuth {
      ...LoginResultFragment
    }
  }
`
