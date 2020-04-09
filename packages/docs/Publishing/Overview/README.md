All Dapps are published to and served from [IPFS](https://ipfs.io), a peer-to-peer decentralized network which uses a
[content-addressable identifier](https://en.wikipedia.org/wiki/Content-addressable_storage) to ensure Dapp integrity. It also ensures that your Dapp will be available as long as
at least one IPFS node has a copy of it.

## Architecture

A standalone version of the solUI renderer is published to IPFS at:

```
https://gateway.temporal.cloud/ipns/ui.solui.dev
```

Your Dapp spec and associated contract artifacts, when published, will return an
IPFS _CID_ (a unique hash representing your content). To then view your Dapp you simply have to pass this CID to the
standalone renderer as follows:

```
https://gateway.temporal.cloud/ipns/ui.solui.dev#l=<Your CID>
```

## solUI cloud

The default [publish command](../../CommandLine/Publish) will upload your Dapp spec and associated contract artifacts
via our backend server to our public IPFS cloud (hosted by [Temporal](https://temporal.cloud/)). Our IPFS node will
ensure your Dapp always
remains accessible even if other nodes stop hosting it. Another benefit is that it saves you from having to
host and manage an IPFS node yourself.

Once successful, a unique
_content hash_ is returned - this is the hash for your Dapp as returned by IPFS and can be used to access
your published data.

For example, after successfully [publishing  you will receive both a CID and a URL for viewing your Dapp, e.g:

![Publish to cloud](../../images/PublishCloud.png)

In addition, the publishing process creates an entry in our [on-chain repository](../Repository) that maps the Dapp hash to the hashes of
the contract bytecodes.

_Note: publishing to our backend involves an [authentication step](../Authentication)_.

## Custom IPFS

You can also [publish to your own IPFS node](../CommandLine/PublishIpfs). No communication or authentication with the solUI cloud is
needed if publishing to your own IPFS node; however **it is your responsibility to manage your node and ensure that your Dapp remains accessible**.

You can still use our IPFS-hosted viewer to render your Dapp by simplifying specifying the full IFPS URL.
For example, if your Dapp is hosted at https://ipfs.yourdomain.com/QmV8HMoH7FGgNdd6oysVfxNyVU6fgtKXQLffgWTohfmLyY then render it using:

```
https://gateway.temporal.cloud/ipns/ui.solui.dev/#l=https://ipfs.yourdomain.com/QmV8HMoH7FGgNdd6oysVfxNyVU6fgtKXQLffgWTohfmLyY
```

## Local folder

You can also [publish to a local folder](../CommandLine/PublishFolder). No communication or authentication with the solUI cloud is needed with this method.

The local folder you publish to will eventually contain 3 files:

```
index.html                    <- HTML page
renderer-<unique hash>.js     <- solUI renderer
dapp-<unique hash>.json       <- your Dapp specification + artifacts
```

You could then upload this folder to a to static web host such as [Github pages](https://pages.github.com/) and have total control over the hosting of your Dapp.











