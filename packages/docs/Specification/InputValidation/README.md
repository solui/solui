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
## Reference

The `type` parameter specifies the input validation type:

* `length`
* `range`
* `allowedTypes`
* `compareToField`
* `matchesBytecode`
* `listSize`

Example:

```js
{
  "type": "length"
}
```

Additional attributes depend on this parameter.

**Validation: length**

The `length` validation checks the length of the input string to ensure its
within the range specified by `min` and `max`.

Example:

```js
{
  /* string must be between 1 and 23 characters in length */
  "type": "length",
  "min": "1",
  "max": "23"
}
```

Example with just `min`:

```js
{
  /* string must be atleast 5 characters in length */
  "type": "length",
  "min": "5"
}
```

Example with just `max`:

```js
{
  /* string must be no more than 17 characters in length */
  "type": "length",
  "max": "17"
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

Example with just `min`:

```js
{
  /* string must represent a number greater than or equal to 2 in value */
  "type": "range",
  "min": "2"
}
```

Example with just `max`:

```js
{
  /* string must represent a number less than or equal to -20 in value */
  "type": "range",
  "max": "-20"
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

**Validation: compareToField**

This validation specifies how the value of the input must relate to the value of another input in the
same panel.

It requires two config parameters:

* `field` - name of other input field within the same panel.
* `operation` - the type of comparision to make. Must be one of:
  - `notEqual`: _input value must NOT equal other input field's value_

Example:

```js
{
  "type": "compareToField",
  "field": "field1",
  "operation": "notEqual",
}
```

**Validation: matchesBytecode**

This validation specifies that the value should be the address of an on-chain contract which has the same
bytecode as the contract specified in the validation config.

This is useful in Dapps where e.g. a user may deploys a contract via one panel and then interacts with
the deployed contract from another panel.

It requires one parameter:

* `contract` - canonical name of contract from the artifacts list.

Example:

```js
{
  "type": "matchesBytecode",
  "contract": "ERC20"
}
```

**Validation: listSize**

This validation only applies to [list inputs](../ListInputs). It works the same as the `length`
validator in that it can be used to specify a minimum and/or maximim array size.

Example:

```js
{
  /* list must be between 1 and 23 items in length */
  "type": "listSize",
  "min": "1",
  "max": "23"
}
```

Example with just `min`:

```js
{
  /* list must be atleast 5 items in length */
  "type": "listSize",
  "min": "5"
}
```

Example with just `max`:

```js
{
  /* list must be no more than 17 items in length */
  "type": "listSize",
  "max": "17"
}
```

