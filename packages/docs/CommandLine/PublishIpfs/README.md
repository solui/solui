Use the `publish-ipfs` command to [publish a Dapp](../../Publishing/Overview) to a custom IPFS node:

```shell
solui publish-ipfs --spec /path/to/json --artifacts /path/to/contract/artifacts --ipfs http://localhost:5000/api/v0
```

A link to viewing your published Dapp will be displayed in the console.

_Note: If you prefer not to have the hassle of maintaining your own IPFS Node please [publish to the solUI cloud](../Publish) instead!_