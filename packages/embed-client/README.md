# `@solui/embed-client`

This is the embeddable client UI generator for [solui](https://solui.dev).

This gets built and stored on IPFS so that the UI rendering system is always
accessible and never down.

_Note: This package does not get published to NPM_.

## Commands

### Building

To build the production code into the `build/` folder:

```shell
yarn build
```

### Testing

To test out the UI generator with a UI spec first let's serve up the built code
via a local static HTTP webserver at http://localhost:5000:

```shell
yarn serve
```

Now ensure you have previously published a UI spec. You will need its IPFS
HTTP address.

Let's say your UI spec is located at https://ipfs.infura.io/ipfs/QmbbNiqTrymoCo4n6PttvMRh3q6RQ1oEk8jQ5HGYeWgJdz. In your browser goto the
following URL:

```
http://localhost:5000#https://ipfs.infura.io/ipfs/QmbbNiqTrymoCo4n6PttvMRh3q6RQ1oEk8jQ5HGYeWgJd
```

### Publishing

To publish the code to local IPFS:

```
yarn publish:local
```
