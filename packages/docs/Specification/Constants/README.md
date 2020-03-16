Named constants provide a method of re-using and sharing fixed string values throughout your Dapp. A named constant can be referenced as the initial value of an [input field](../Inputs) and also contract [execution](../Execs) parameters.

## Structure

```js
{
  ...,
  "constants": {
    "name1": {
      "default": "value1"
    },
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
  "firstName": {
    "default": "John"
  }
}
```

The above constant can referenced anywhere within the Dapp spec using `@constant[firstName]`.

**How values are specified**

The _value_ of a constant must be specified as a mapping of network ids to a value:

```js
"constants": {
  /*
    If on the Rinkeby (network id = 4) the value will be `100`. On Ropsten (network id = 3) its value will be `200`. And all other
    networks (i.e. the `default`) the value will be `10`.
  */
  "supply": {
    "default": "10",
    "4": "100",
    "3": "200"
  },
  /*
    If on the Rinkeby (network id = 4) the value will be `[5, 6]`. On Ropsten (network id = 3) its value will be `[10]`. And all other
    networks (i.e. the `default`) the value will be `[1, 2, 3]`.
  */
  "intervals": {
    "default": [ 1, 2, 3 ],
    "4": [ 5, 6 ],
    "3": [ 10 ],
  }
}
```

**How to use**

To refer to a constant, use the `@constants[name]` syntax, where `name` is the the actual constant name. For example:

```js
{
  "constants": {
    "supply": {
      "default": "100"
    }
  }
  ,
  "panels": [
    {
      ...,
      "execs": [
        {
          ...,
          "supply": "@constant[supply]"
        }
      ]
    }
  ]
}
```

If the value of a constants is an object then _subscripts_ can be used to refer to nested values:

```js
{
  "constants": {
    "base": {
      "default": {
        "supply": "10",
        "name": "yin"
      }
    }
  },
  "panels": [
    {
      ...,
      "execs": [
        {
          ...,
          "supply": "@constant[base][supply]",
          "name": "@constant[base][name]"
        }
      ]
    }
  ]
}
```
