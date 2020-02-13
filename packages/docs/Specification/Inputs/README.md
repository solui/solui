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
          "initialValue": "...",
          "type": "...",
          "unit": "...",
          "scale": "...",
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

**initialValue** _(optional)_

Initial value to display in the input field, specified as a string.

Example:

```js
{
  "initialValue": "100"
}
```

**unit** _(optional)_

Applies to `type`: `int`

This is user-friendly text that gets shown in the tooltip
popup next to the input label:

![Field unit](../../images/FieldUnit.png)

Example:

```js
{
  "unit": "TOKEN"
}
```

**scale** _(optional)_

Applies to `type`: `int`

This is how to much to scale the input value by to obtain the real integer value. This
means multiplying the input value by `10^scale` to obtain the real value.

For example, if inputting an ETH value then the scale should be set to 18 to
ensure that the real value sent to the contract is measured in WEI.

Example:

```js
{
  "scale": 18
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
