# SolUI

Declarative UIs for smart contracts.

_TBC..._

## Development

Install and setup:

```shell
$ yarn bootstrap
```

To add dependency across all packages:

```shell
$ yarn add --dev -W <package_name>
```

To add dependency for specific packages:

```shell
$ yarn lerna add --scope=@solui/<pkg_which_needs_dependency> @solui/<package_which_is_the_dependency>
```

To create new package (note: if `folder_name` = `pkg1` then `name`
  in `package.json` should be set to `@solui/pkg1`):

```shell
$ yarn lerna create <folder_name>
```
