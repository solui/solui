import { GraphQLDateTime } from 'graphql-iso-date'
import GraphQLJSON from 'graphql-type-json'

import { EthereumAddressScalarType } from './scalars'

export const defaultResolvers = {
  EthereumAddress: EthereumAddressScalarType,
  DateTime: GraphQLDateTime,
  JSON: GraphQLJSON,
}
