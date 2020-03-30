Transformations allow you to transform an [output value](../Outputs) into other formats prior to display. For example, you may
wish to treat a returned integer as a timestamp and display it as user-friendly datetime string.

Multiple transformations can be specified for a given value, in which case they are _chained_ together,
i.e. the output of a given transformation in the chain becomes the input of the next transformation, and so on.

## Structure

```js
{
  ...,
  "panels": [
    {
      ...,
      "outputs": [
        {
          "transform": [
            {
              "type": "...",
              ...
            },
            {
              "type": "...",
              ...
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

The `type` parameter specifies the transformation type:

* `intToDateString`
* `intToScaledIntString`
* `intToHexString`
* `intToBinaryString`
* `stringToSpacedSuffixedString`

_Note: transformations are named in the format _`<inputType>...<outputType>`_ for ease of use_.

Example:

```js
{
  "type": "intToDateString"
}
```

Additional attributes depend on this parameter.

**Transformation: intToDateString**

This treats a number value as a [blockchain-generated timestamp](https://solidity.readthedocs.io/en/v0.5.3/units-and-global-variables.html)
and converts it to its string representation.

Example:

```js
{
  "type": "intToDateString"
}
```

The string formatting is performed by the [date-fns library](https://date-fns.org/v1.30.1/docs/format) and the default
format pattern is `MMM d, yyyy`. For example, the value `1585167477` would be transformed to `Mar 25, 2020`.

To change the pattern use the `format` parameter:

```js
{
  "type": "intToDateString",
  "format": "HH:mm"
}
```

The value `1585167477` would now be transformed to `20:17`.

_Note: full pattern information is available in the [date-fns/format]([date-fns library](https://date-fns.org/v1.30.1/docs/format)) docs_.

**Transformation: intToScaledIntString**

This scales a number value by the given scaling amount and returns a base-10 string representation. This means
multiplying the input value by `10^scale` to obtain the final value.

Example (`10` -> `"10000"`):

```js
{
  "type": "intToScaledIntString",
  "scale": "3"
}
```

If outputting an ETH value (which gets returned as WEI from a contract call) then the scale should be set to `-18`.

**Transformation: intToHexString**

This converts a number value to its hexadecimal string representation.

Example (`255` -> `"FF"`):

```js
{
  "type": "intToHexString"
}
```

**Transformation: intToBinaryString**

This converts a number value to its binary string representation.

Example (`4` -> `"100"`):

```js
{
  "type": "intToBinaryString"
}
```

**Transformation: stringToSpacedSuffixedString**

This adds a suffix to a string value, leaving a space in between.

Example (`"10"` -> `"10 eth"`):

```js
{
  "type": "stringToSpacedSuffixedString",
  "suffix": "eth"
}
```




