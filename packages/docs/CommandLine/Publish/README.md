Use the `publish` command to [publish a Dapp](../../Publishing/Overview) to the solUI cloud:

```shell
solui publish --spec /path/to/json --artifacts /path/to/contract/artifacts
```

If you are not yet authenticated with the solUI backend then the [login process](../Login) will first be
performed.

Once authentication is complete re-run the publish command to  upload the Dapp and artifacts to the
backend. The backend will check to see if the Dapp already exists in the repository under your user id.

If the Dapp doesn't yet exist in the repository it will be created. You will then be told to visit the page to
finalize publication by registering your Dapp with the [on-chain repository](../../Publishing/Repository):

![Finalize](../images/Finalize.png)

Once registered a URL for your published Dapp will be displayed in your CLI console.




