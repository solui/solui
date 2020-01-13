# @solui/utils

This is a utility belt library for [solUI](https://solui.dev).

_Note: This relies on a forked version of the [IPFS HTTP Client](https://github.com/solui/js-ipfs-http-client/tree/fix_cids_import)_.

## Installation

```shell
npm install @solui/utils
```

## Example usage

```js
const { isEthereumAddress } = require('@solui/utils')

console.log( isEthereumAddress('0x0000000000000000000000000000000000000001') )
```

[Read full documentation](https://solui.dev/docs/packages/utils).

## License

Copyright 2019 solUI Contributors

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

