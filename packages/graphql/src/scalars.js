import { GraphQLScalarType } from 'graphql/type'
import { Kind } from 'graphql/language'
import { isEthereumAddress } from '@solui/utils'

export const EthereumAddressScalarType = new GraphQLScalarType({
  name: 'EthereumAddress',
  description: 'Represents Ethereum addresses.',
  serialize: value => {
    return value
  },
  parseValue: value => {
    if (typeof value !== 'string') {
      throw new Error(`Cannot parse non-string: ${value}`)
    }

    if (!isEthereumAddress(value)) {
      throw new Error(`Invalid Ethereum address: ${value}`)
    }

    return value
  },
  parseLiteral: ast => {
    switch (ast.kind) {
      case Kind.STRING:
        return ast.value
      default:
        return undefined
    }
  }
})
