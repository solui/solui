import gql from 'graphql-tag'

export const GetAuthTokenQuery = gql`
  query getAuthToken ($loginToken: String!) {
    authToken: getAuthToken(loginToken: $loginToken) @disableAuth {
      token
      expires
    }
  }
`
