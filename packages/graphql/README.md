# `@solui/graphql`

GraphQL utilities for [solUI](https://solui.dev):

* Queries and mutations for interacting with backend.
* Method to setup a new client instance.
* Authentication handling logic.
* Error handling utilities.


## Installation

```shell
npm install @solui/graphql
```

```shell
yarn add @solui/graphql
```

## Example usage

Search for packages by keyword:

```js
const { createApolloClient, SearchQuery } = require('@solui/graphql')

const client = createApolloClient({
  endpoint: `https://solui.dev/api/graphql`,
  name: 'my-client',
  version: '1.0.0',
})

// search for package by keyword
const { data: { search } } = await client.query({
  query: SearchQuery,
  fetchPolicy: 'cache-and-network',
  variables: {
    criteria: {
      keyword: 'erc20'
    }
  }
})

// output results
console.log(search)
```

For a full list of queries please see the [GraphQL schema](./src/typeDefs.js).

[Read full documentation](https://solui.dev/docs/packages/graphql).

## License

Copyright 2019 solUI Contributors

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
