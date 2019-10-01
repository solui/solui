import fetch from 'node-fetch'
import { HttpLink } from 'apollo-link-http'

export default ({ serverHost }) => new HttpLink({ uri: `${serverHost}/q`, fetch })
