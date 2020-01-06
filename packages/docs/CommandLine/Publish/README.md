Use the `publish` command to [publish a UI](../../Publishing).

## Publish to solUI cloud

To publish to the solUI cloud IPFS daemon:

```shell
solui publish --spec /path/to/json --artifacts /path/to/contract/artifacts
```

If you are not yet authenticated with the solUI backend then the [login process](../Login) will first be
performed.

Once authentication is complete re-run the publish command to  upload the spec and artifacts to the
backend. The backend will check the [spec id](../../Specification) to
see if it already exists in the repository under your user id. If the spec id doesn't yet exist in the repository it will
be created. Otherwise, it will be published and a link to viewing your published UI will be displayed in the console:


_Note: The backend will complain if you attempt to publish a duplicate UI that is already published_.

## Publish to local IPFS daemon

Let's say you have a local IPFS daemon running at endpoint: http://localhost:5000/api/v0. To publish to this:

```shell
solui publish --spec /path/to/json --artifacts /path/to/contract/artifacts --custom-ipfs http://localhost:5000/api/v0
```

A link to viewing your published UI will be displayed in the console:
