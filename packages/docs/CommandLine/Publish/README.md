Use the `publish` command to [publish a spec](../../Publishing) to the online repository.

```shell
solui publish --spec /path/to/json --artifacts /path/to/contract/artifacts
```

If you are not yet authenticated with the solUI repository then the [login process](../Login) will first be
performed.

Once authentication is complete the CLI will upload the spec and artifacts to the
repository. The repository will check the [spec id](../../Specification) to
see if it already exists in the repository.

If the spec doesn't yet exist in the repository it will be created. Otherwise,
a new [version](../../Publishing) will be published for the spec.
If there have been no changes made to the spec or artifacts since the last
published version then nothing new will be published.

Once published the CLI will output a link to view the published spec version.
