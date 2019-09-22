import fetch from 'node-fetch'
import { HttpLink } from 'apollo-link-http'

export default () => new HttpLink({ uri: `/graphql`, fetch })
