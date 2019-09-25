import { ApolloLink } from 'apollo-link'

import http from './http'
import auth from './auth'

export default args => ApolloLink.from([ auth(args), http(args) ])
