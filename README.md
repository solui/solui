# solUI

_"Generate UIs for smart contracts"_

solUI allows you to quickly and easily define, build and deploy user-friendly interfaces for your smart contracts on any Ethereum chain.

## Getting started

Please [read the docs](https://solui.dev/docs) for more info and instructions on
getting started.

## For contributors

**Note: The instructions below are for developers who wish to work on the solUI
codebase itself and contribute improvements**

Bootstrap the [monorepo](https://lerna.js.org/):

```shell
$ npm run bootstrap
```

At this point you can go into [individual packages](./packages) and test them out.

To create new package (note: if `folder_name` = `pkg1` then `name`
  in `pkg1/package.json` should be set to `@solui/pkg1`):

```shell
$ npm run lerna create <folder_name>
```

Ensure you set the license to `MIT` and include a corresponding section in the
README.md.

### Publishing

Update version:

```
$ npm run prepare-release <x.y.z>
```

Publish NPM packages:

```
$ npm run release
```

## License

AGPLv3
