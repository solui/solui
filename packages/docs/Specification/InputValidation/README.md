Input validations define validation checks to be performed on input field values.

## Structure

```js
{
  ...,
  "panels": [
    {
      ...,
      "inputs": [
        {
          ...,
          "validation": [
            {
              "type": "length",
              "min": "2",
              "max": "10"
            },
            ...
          ]
        },
        ...
      ]
    }
  ]
}
```

## Reference

The `type` parameter specifies the input validation type:

* `length`
* `range`
* `allowedTypes`

Example:

```js
{
  "type": "length"
}
```

Additional attributes depend on the validation `type`.

**Validation: length**

The `length` validation checks the length of the input string to ensure its
within the range specified by `min` and `max`.

Example :

```js
{
  /* string must between 1 and 23 characters in length */
  "type": "length",
  "min": "1",
  "max": "23"
}
```

**Validation: range**

The `range` validation checks that the input string represents a number between
`min` and `max` boundary values. The boundary values can be positive or negative 256-bit integer values.

Example :

```js
{
  /* string must represent a number between -10 and 23 in value */
  "type": "range",
  "min": "-10",
  "max": "23"
}
```

**Validation: allowedTypes**

If the input type is `address` then this validation check specifies what types of
Ethereum addresses are allowed. Specifically there are two address types:

* `contract` - an on-chain contract address.
* `eoa` - an "externally-owned account", i.e. a standard Ethereum address that isn't an on-chain contract.

Examples:

```js
{
  /* address must be a contract address, not an eoa */
  "type": "allowedTypes",
  "contract": true
}
```

```js
{
  /* address can be either an eoa or contract address */
  "type": "allowedTypes",
  "contract": true,
  "eoa": true
}
```