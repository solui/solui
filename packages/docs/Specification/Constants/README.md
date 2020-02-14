Named constants provide a method of re-using and sharing fixed string values throughout your Dapp. A named constant can be referenced as the initial value of an [input field](../Inputs) and also contract [execution](../Execs) parameters.

## Structure

```js
{
  ...,
  "constants": {
    "name1": "value1",
    "name2": {
      "default": "value2-default",
      "4": "value2-rinkeby",
      "3": "value2-ropsten",
      ...
    },
    ...
  },
}
```

## Reference

**How naming works**

Constants are specified as a mapping of key-value pairs contained within the top-level `constants` key.

The _key_ is the name of the constants. For example, given:

```js
"constants": {
  "firstName": "John"
}
```

The above constant can referenced anywhere within the Dapp spec using `@constant[firstName]`.

**How values are specified**

The _value_ of a constant can be specified as either:

* A fixed string
* A mapping of network id to strings

The above example uses a fixed stirng representation:

```js
"constants": {
  "firstName": "John"
}
```

An example of using a mapping:

```js
"constants": {
  "supply": {
    "default": "10",
    "4": "100",
    "3": "200"
  }
}
```

The above constant resolves to a different value depending on the Ethereum network the Dapp is currently being run on. If on the Rinkeby (network id = 4) the value will be `100`. On Ropsten (network id = 3) the value will be `200`. And all other networks (i.e. the `default`) the value will be `10`.

_Note: When using a mapping the `default` key-value pair MUST be specified_.

