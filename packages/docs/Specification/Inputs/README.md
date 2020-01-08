Inputs define the input fields that show in a panel.

Inputs have types, optional validation checks and ultimately feed into contract method arguments. By default
inputs are rendered in the order in which they're defined in a panel.

## Structure

```js
{
  ...,
  "panels": [
    {
      ...,
      "inputs": [
        {
          "name": "...",
          "title": "...",
          "type": "...",
          "validation": [ ... ]
        },
        ...
      ]
    }
  ]
}
```

## Reference

**name**

The name of the input. This is not shown to the user but is instead the canonical internal name of the input. It must be unique in the list of input names for its parent panel.

Example:

```js
{
  "name": "tokenName"
}
```

**title**

The user-friendly name of the input. This is shown the user as the label for the input.

Example:

```js
{
  "title": "Token name"
}
```

**type**

The input type. At present this must be one of:

* `address`
* `bool`
* `bytes32`
* `int`
* `string`

Example:

```js
{
  "type": "bytes32"
}
```

**validation** _(optional)_

List of [validation checks](../InputValidation) for this input field.

Example:

```js
{
  "validation": [
    {
      ...
      "type": "..."
    },
    ...
  ]
}
```
