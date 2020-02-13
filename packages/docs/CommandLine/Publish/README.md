Use the `publish` command to [publish a Dapp](../../Publishing/Overview) to the solUI cloud:

```shell
solui publish --spec /path/to/json --artifacts /path/to/contract/artifacts
```

If you are not yet authenticated with the solUI backend then the [login process](../Login) will first be
performed.

Once authentication is complete re-run the publish command to  upload the spec and artifacts to the
backend. The backend will check the [spec id](../../Specification) to
see if it already exists in the repository under your user id. If the spec id doesn't yet exist in the repository it will
be created. Otherwise, it will be published and a link to viewing your published Dapp will be displayed in the console.


