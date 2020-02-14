Use the `publish-folder` command to [publish a Dapp](../../Publishing/Overview) to a local folder:

```shell
solui publish-folder --spec /path/to/json --artifacts /path/to/contract/artifacts --folder /usr/local/share/dapp
```

This command will download the [solUI renderer](../../Publishing/Overview) and place it inside your chosen output folder alongside your Dapp specification.

If you view this folder using a static file webserver you should see the rendered Dapp in all its glory. For example, using the [serve package](https://www.npmjs.com/package/serve):

```
npx serve /usr/local/share/dapp
```

Then visit http://localhost:5000 (assuming this is what `serve` outputs) in your web browser.
