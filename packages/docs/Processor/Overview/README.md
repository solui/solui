The processor is the engine of the solUI system.

It us responsible for:

* Validating a given spec.
* Validating user inputs.
* Rendering a spec user interface.
* Executing a panel and collecting errors and results the results.

Structurally speaking, it is a spec parser with _callback_ hooks for customizing how
different spec elements are handled.

The core processing method in the [processor package](https://www.npmjs.com/package/@solui/processor) is `process()`:

```js
async process ({ spec, artifacts }, callbacks = {})
```

If `callbacks` is not provided then by default the processor just validates a
spec without performing any further actions. The accepted `callbacks` are:

```js
/**
 * Processing of the spec has started.
 */
async startUi ()
/**
 * Processing of the spec has ended.
 */
async endUi ()
/**
 * Processing of a panel has started.
 */
async startPanel ()
/**
 * Processing of a panel has ended.
 */
async endPanel ()
/**
 * Process given user input field and get its current value.
 */
async processInput ()

// The following callbacks should only be supplied if you wish to execute the spec

/**
 * Deploy a contract.
 */
async deployContract ()
/**
 * Call a contract method - `eth_call`.
 */
async callMethod ()
/**
 * Call a contract method via a transaction - `eth_sendTransaction`.
 */
async sendTransaction ()
```

The other methods exported by the processor package ultimately call through to
the `process()` method with callbacks defined.

Take the following spec as an example:

```js
{
  "version": 1,
  "id": "erc20",
  "title": "ERC-20",
  "panels": [
    {
      "id": "createInstance",
      "title": "Create new token",
      "inputs": [
        {
          "name": "name",
          "title": "Name",
          "type": "string",
          "length": {
            "min": "5",
            "max": "100"
          }
        },
      ],
      "execs": [
        {
          "type": "deploy",
          "contract": "ERC20",
          "args": {
            "_name": "name",
            "_symbol": "symbol",
            "_initialSupply": "initialSupply"
          },
          "saveResultAsInput": "contractAddress"
        }
      ],
      "outputs": [
        {
          "title": "New contract address",
          "type": "address",
          "param": "contractAddress"
        }
      ]
    }
  ]
}
```

The processor will invoke the callbacks as such:

```js
startUi('erc20', { ... })

startPanel('createInstance', { ... })

processInput('erc20.panel[createInstance]', 'name', { ... })

if (/* inputs are valid and can be mapped to contract methods */) {
  deployContract('erc20.panel[createInstance].exec[0]', { ... })
}

endPanel('createInstance')

endUi('erc20')
```

Thus, the processor works as a _"builder"_ of sorts, notifying the caller of
groups, panes and inputs as and when the processor encounters them. This flow
underpins validation, rendering and execution.

All other processing methods in the [processor package](https://www.npmjs.com/package/@solui/processor) ultimately call through to the `process()` method.

## Validation

When the [CLI](../../CommandLine) loads a spec into memory or detects a
change in a loaded spec it first validates it using the processor to ensure
that the spec configuration is itself valid.

This includes checking:

* contract names match what's in the list of artifacts.
* contract method names and arguments list match what's in the contract ABIs.
* referenced inputs are valid.
* panel ids are unique.
* textual content (e.g. title) is within minimum and maximum character limits.
* ...etc

The processor keeps track of parsing and configuration errors as it traverses a
spec.

If any errors are encountered then an `Error` object gets thrown, and the `details`
property of this object will be a list of user-friendly error messages. For
example, the following spec is missing properties:

```js
{
  "version": 1,
  "id": "bad-spec",
  "title": "bad spec",
  "panels": [
    {
      "id": "panel1"
    }
  ]
}
```

The validation result will be:

```
bad-spec.panel[panel1]: title must be set
```

## Input validation

If the user has input values then these can also validated by the processor,
with a list of validation errors returned back to the caller.

Input validation includes checking:

* addresses are in a valid format.
* addresses are of an allowed type (see below).
* numbers are within a valid range.
* ...etc

The validation method is:

* `validatePanel()` - validate a [panel](../../Specification/Panels) inputs.

If an input field is expecting an Ethereum address then its configuration
usually also specifies one or more of the type of addresses allowed (see [inputs](../../Specification/Inputs)).

If a `node` instance (see [utils package](https://www.npmjs.com/package/@solui/utils)) is passed in to the validation methods then the
processor will check on-chain to ensure that any input address values match
their corresponding allowed types. For example, if the user inputs a contract
address but the field does not allow contract addresses as input then validation will fail for
that field.

## Rendering

The default rendering engine builds a [React](https://reactjs.org) component tree. React was
chosen due to speed of development and because its component hierarchy maps
quite well to the hierarchy of a solUI spec.

However, the processing
system is platform-agnostic such that any frontend UI library can
be used. In fact, any platform that supports Javascript execution (e.g. React Native)
can easily render a spec.

## Execution

Panels are executed by calling the `executePanel()` function:

```js
async executePanel ({ artifacts, spec, panelId, inputs, node })
```

The processor first validates the spec and inputs before running through the
[execution tasks](../../Specification/Execs) defined for the panel. Final outputs are  returned as an `Object`
of key-value pairs according to the defined [outputs](../../Specification/Outputs) for the panel.

If you wish to customize panel execution you can do so by calling the `process()`
method directly whilst overriding the following callbacks:

```js
async deployContract ()
async callMethod ()
async sendTransaction ()
```

Indeed, the `executePanel()` method (above) does exactly this - it internaly calls `process()` and overrides
the callbacks.