# `@solui/react`

[React](https://reactjs.org/) components for [solUI](https://solui.dev).

## Installation

_(Note: peer dependencies must also be installed)_

```shell
npm install @solui/react react react-dom
```

## Example usage

Render a UI:

```js
const React = require('react')
const { process as processSpec, validateGroupInputs, validatePanel, executePanel } = require('@solui/processor')
const { Dapp } = require('@solui/react')

// if you're using the Tooltip component you will need to import its CSS
import "@solui/react/dist/tooltip.css"

export default ({ spec, artifacts, network }) => {
  return (
    <Dapp
      network={network}
      spec={spec}
      artifacts={artifacts}
      processSpec={processSpec}
      validateGroupInputs={validateGroupInputs}
      validatePanel={validatePanel}
      executePanel={executePanel}
    />
  )
}
```

[Read full documentation](https://solui.dev/docs/packages/react).

## License

Copyright 2019 solUI Contributors

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
