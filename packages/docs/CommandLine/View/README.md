Use the `view` command to interact with a UI rendered from a spec:

```shell
solui view --spec /path/to/json --artifacts /path/to/contract/artifacts
```

* `/path/to/jon` - path to your solUI spec `.json` file
* `/path/to/contract/artifacts` - path to the Solidity compiler JSON build
artifacts folder containing ABIs and bytecodes for your contracts.

## Example usage

Clone the demo repository and set it up:

```shell
git clone https://github.com/solui/demo.git
cd demo
yarn
```

Compile and deploy the demo contracts:

```shell
yarn truffle compile
yarn truffle migrate
```

Now view the interface:

```shell
solui view --spec contracts/erc20/ui.json --artifacts build/contracts
```

Open up the browser to http://localhost:3001. You should now be able to view
and use the ERC20 token UI:

(img)

## Spec validation

When you view a spec, solUI will first validate the spec and immediately
display an error if there are any problems.

(img)

## Auto reload

The CLI will watch both the spec file and artifacts folders for changes. If
any file changes are detected then the in-browser UI will seamlessly
automatically reload.

This makes for a very smooth _edit -> save -> preview_ development cycle.

The CLI will output information to the terminal whenever a change is detected
and the UI is to be reloaded:

(img)

## Additional options

To change the default HTTP listening port for the UI previewer:

```shell
solui view --port 12345 ...
```

For more verbose logging in the terminal:

```shell
solui view --verbose ...
```
