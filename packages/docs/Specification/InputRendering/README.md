Some built-in environment variables are available for use in a Dapp spec. They function in a similar way to [constants](../Constants) in that they are constant, unchange-able values. The difference is that they are automatically available and do not have to be explicitly declared.


## Reference

At present the following environment variables are available:

* `account` - the user's account address, i.e. the active Metamask account or the active address in their connected wallet

**How to use**

To refer to a constant, use the `@env[name]` syntax, where `name` is the the actual constant name. See the docs for [inputs](../Inputs) for examples.
