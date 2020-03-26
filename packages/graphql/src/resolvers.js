import { GraphQLDateTime } from 'graphql-iso-date'
import GraphQLJSON from 'graphql-type-json'

import { EthereumAddressScalarType } from './scalars'

export const defaultResolvers = {
  EthereumAddress: EthereumAddressScalarType,
  DateTime: GraphQLDateTime,
  JSON: GraphQLJSON,
  ProfileResult: {
    __resolveType({ error }) {
      return error ? 'Error' : 'User'
    }
  },
  PublishResult: {
    __resolveType({ error, finalizeUrl }) {
      if (error) {
        return 'Error'
      } else if (finalizeUrl) {
        return 'PublishFinalize'
      } else {
        return 'PublishSuccess'
      }
    }
  },
  LoginResult: {
    __resolveType({ error }) {
      return error ? 'Error' : 'AuthToken'
    }
  },
  AuthTokenResult: {
    __resolveType({ error }) {
      return error ? 'Error' : 'AuthToken'
    }
  },
  ReleaseResult: {
    __resolveType({ error }) {
      return error ? 'Error' : 'Release'
    }
  },
  ReleaseListResult: {
    __resolveType({ error }) {
      return error ? 'Error' : 'ReleaseList'
    }
  },
  PublishToChainResult: {
    __resolveType({ error }) {
      return error ? 'Error' : 'PublishToChainSuccess'
    }
  },
  DappChainInfoResult: {
    __resolveType(args) {
      console.log(args)
      return args.error ? 'Error' : 'DappChainInfo'
    }
  },
}
