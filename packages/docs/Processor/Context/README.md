The processor has a concept of a _context_ within each processing run takes
places.

A context keeps track of inputs, execution task outputs, validation and
execution errors, and the current point in the spec being processed so that
more useful error messages can be returned to the caller.

The `process()` method will return a [RootContext instance](https://github.com/solui/solui/blob/master/packages/processor/src/context.js) once
processing is complete. This instance holds both the errors and outputs from the processing flow:

```js
ctx = await process(...)

console.log( ctx.errors() ) // errors
console.log( ctx.outputs() ) // outputs
```

## Context ids

Contexts also allow for generating path-like unique ids for every element within
a spec. This makes it easier to pinpoint the source of errors and user input
validation results.

For example, ids for the following spec will be:

```js
{ /* id: erc20 */
  "version": 1,
  "id": "erc20",
  "title": "ERC-20",
  "panels": [
    {
      /* context id: erc20.panel[createInstance] */
      "id": "createInstance",
      "title": "Create new token",
      "inputs": [
        {
          /* context id: erc20.panel[createInstance].input[name] */
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
          /* context id: erc20.panel[createInstance].exec[0] */
          "type": "deploy",
          "contract": "ERC20",
          "args": {
            "_name": "name",
            "_symbol": "symbol",
            "_initialSupply": "initialSupply"
          },
          "saveResultAs": "contractAddress"
        }
      ],
      "outputs": [
        {
          /* context id: erc20.panel[createInstance].output[0] */
          "title": "New contract address",
          "type": "address",
          "param": "contractAddress"
        }
      ]
    }
  ]
}
```
