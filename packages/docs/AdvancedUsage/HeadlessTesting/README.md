Headless testing means being able to run unit tests against your Dapp without having to render an actual UI. solUI makes this possible through a [separation of rendering and processing](../../Processor/Overview).

To perform headless testing or programmatic execution of a Dapp we need to:

1. Setup a web3 connection that solUI can use
2. Load in the Dapp spec JSON and artifacts JSON
3. Call the processor, asking to validate or execute the Dapp

Here is a basic example of how this would work:

```js
import { assertSpecValid, executePanel } from '@solui/processor'
import { getNetworkInfoFromUrl } from '@solui/utils'
import { loadSpec, loadArtifacts } from '@solui/cli'
import path from 'path'

/**
 * Assume we're using the same spec as https://github.com/solui/demo/blob/master/contracts/erc20/ui.json
 */

async function main () {
  // load spec definition
  const spec = loadSpec(path.join(__dirname, './spec.json'))
  // load ABI JSON files from Hardhat/Truffle contracts build folder
  const artifacts = loadArtifacts(path.join(__dirname, './build/contracts'))
  // setup network connection
  const network = await getNetworkInfoFromUrl('http://localhost:8545')

  // ensure the spec is valid
  await assertSpecValid({ artifacts, spec, network })

  // execute the panel to deploy a new ERC-20 token
  const results = await executePanel({
    artifacts,
    spec,
    panelId: 'create',
    inputs: {
      '<root>.panels[create].inputs[name]': 'My token',
      '<root>.panels[create].inputs[symbol]': 'MYTOK',
      '<root>.panels[create].inputs[initialSupply]': 100,
    },
    network,
  })

  // output to console
  results.forEach(({ title, result }) => {
    console.log(`${title}: ${result}`)
  })

  // ...do some additional testing on the results, etc
}

main().catch(err => {
  console.error(err)
  process.exit(-1)
})
```


