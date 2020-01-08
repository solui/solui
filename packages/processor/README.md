# `@solui/processor`

Parser and processor for [solUI](https://solui.dev):

* Parses and validates UI specs with on-chain checking.
* Renders UI specs with platform-agnostic render callbacks.
* Executes UI specs with on-chain interaction.

## Installation

```shell
npm install @solui/processor
```

```shell
yarn add @solui/processor
```

## Example usage

Execute a panel programmatically:

```js
const Web3 = require('web3')
const { executePanel } = require('@solui/processor')

const spec = require('./contracts/ui.json')

const artifacts = {
  Token: require('./build/contracts/Token.json')
}

const web3 = new Web3('https://mainnet.infura.io?token=MYTOKEN')

const panelId - 'id-of-a-panel-in-the-group'

const inputs = {
  contractAddress: '0x.....',
  anotherInputValue: 'foo bar',
  ...
}

const outputs = await executePanel({
  spec,
  artifacts,
  web3,
  panelId,
  inputs,
})

console.log(outputs)
```

[Read full documentation](https://solui.dev/docs/processor).

## License

Copyright 2019 solUI Contributors

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
