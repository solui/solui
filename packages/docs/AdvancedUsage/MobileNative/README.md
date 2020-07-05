Building a native mobile Dapp using a Javascript-based framework (e.g. React Native) is entirely possible thanks to solUI's [separation of rendering from processing](../../Processor/Overview).

The `process()` function exported by the `@solui/processor` package provides all
the necessary builder hooks for using whatever renderer you wish.

Here is an example of how this might look:

```js
import { assertSpecValid, process } from '@solui/processor'
import { getNetworkInfoFromUrl } from '@solui/utils'

const spec = // ... JSON
const artifacts = // ... JSON
const network = await getNetworkInfoFromUrl('http://localhost:8545')

// ensure the spec is valid
await assertSpecValid({ artifacts, spec, network })

const interfaceBuilder = {
  startUi: id, attrs) => {
    // start building Dapp UI
  }

  endUi: () => {
    // finish building Dapp UI
  }

  startPanel: async (id, attrs) => {
    // start building a panel
  }

  endPanel: async () => {
    // finish building current panel
  }

  processInput: async (...args) => {
    // build an input field
  }
}

await process({ artifacts, spec, network }, interfaceBuilder)
```

The `interfaceBuilder` above contains the hooks which get called at various points
during the spec processing flow. These hooks should internally call the necessary
UI rendering commands for the current platform.

To see an example of this in use check out the `Interface` component in the [solUI react package](https://github.com/solui/solui/tree/master/packages/react).