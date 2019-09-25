import gql from 'graphql-tag'

export const PublishMutation = gql`
  mutation publish ($bundle: PublishInput!) {
    publish(bundle: $bundle) @requireAuth {
      versionId
      error
    }
  }
`

export const LoginMutation = gql`
  mutation login ($email: String!, $loginToken: String!) {
    login(email: $email, loginToken: $loginToken) @disableAuth
  }
`
