import { gql, createApolloClient } from '@solui/graphql'

import { version } from '../package.json'
import { SERVER_GRAPHQL_ENDPOINT } from './config'

const PackageQuery = gql`
  query getPackages {
    packages: search(criteria:{ bytecodeHash: "0xd32af530a8f951b385c5cea2d8b3cf4b136f789b4b75db336f8b324605a28cbd", page:2 }) {
      packages {
        id
        name
        author {
          id
        }
        latestVersion {
          id
          title
          description
          created
        }
      }
      page
      numPages
    }
  }
`

export const publish = async ({ spec, artifacts, log = () => {} }) => {
  const client = createApolloClient(SERVER_GRAPHQL_ENDPOINT, {
    name: '@solui/cli',
    version,
  })

  log(`Publishing spec ${spec.id} to public repository...`)

  const ret = await client.query({ query: PackageQuery })

  console.log(ret)

  log(`Successfully published!`)
}
