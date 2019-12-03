import gql from 'graphql-tag'

/**
 * Publish package.
 * @type {Mutation}
 */
export const PublishMutation = gql`
  mutation publish ($bundle: PublishInput!) {
    publish(bundle: $bundle) @requireAuth {
      versionId
      error
    }
  }
`

/**
 * Login user.
 * @type {Mutation}
 */
export const LoginMutation = gql`
  mutation login ($email: String!, $loginToken: String!) {
    login(email: $email, loginToken: $loginToken) @disableAuth
  }
`
