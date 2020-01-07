Published UIs can be embedded in any webpage as using an `iframe` HTML tag. For example, if the content hash of your published UI is `QmV8HMoH7FGgNdd6oysVfxNyVU6fgtKXQLffgWTohfmLyY` then embed it in an existing page using:

```html
<iframe src="https://gateway.temporal.cloud/ipns/ui.solui.dev/#l=QmV8HMoH7FGgNdd6oysVfxNyVU6fgtKXQLffgWTohfmLyY" width="800" height="600" />
```

Note that the `width` and `height` parameters can be set however you see fit. The solUI renderer will auto-fit the content as best as it can. All other normal `iframe` HTML attributes can also be customized you wish.

When viewing an embedded solUI interface you can grab it embedding URL via the menu on the top-right:

![Share and embed](../../images/EmbedMenu.png)

The _View source_ link will allow you to view the full JSON for both the spec and the contract artifacts.

## Customize styling

The default colour scheme for the UI components can be customized on a per-embedded-instance basis. For example, to replace the default gradient background with a plain `black` colour, append `&layoutBgColor=black` to the view URL:

```
https://gateway.temporal.cloud/ipns/ui.solui.dev/#l=QmV8HMoH7FGgNdd6oysVfxNyVU6fgtKXQLffgWTohfmLyY&layoutBgColor=black
```

Until a more robust styling mechanism is implemented you can currently use this mechanism to override any of the colours in [the default theme](https://github.com/solui/solui/blob/master/packages/styles/src/themes/1.js).



