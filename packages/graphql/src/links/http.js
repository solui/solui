import fetch from 'node-fetch'
import { HttpLink } from 'apollo-link-http'

export default ({ uri }) => new HttpLink({ uri, fetch })
