import Document, { Main, Head, NextScript } from 'next/document'

import { APP_STATE_KEYS } from '../common/appState'

export default class MyDocument extends Document {
  static async getInitialProps (ctx) {
    const initialProps = await Document.getInitialProps(ctx)

    const ret = { ...initialProps }

    ret.appState = APP_STATE_KEYS.reduce((m, k) => {
      m[k] = ctx.res[k]
      return m
    }, {})

    return ret
  }

  render () {
    return (
      <html>
        <Head>
          <meta httpEquiv="X-UA-Compatible" content="IE=edge,chrome=1"/>
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1, shrink-to-fit=no, maximum-scale=1, user-scalable=no"
          />
        </Head>
        <body>
          <Main />
          <script type="text/javascript" dangerouslySetInnerHTML={{
            __html: `
              window.appState = ${JSON.stringify(this.props.appState, null, 2)};
            `
          }}></script>
          <NextScript />
        </body>
      </html>
    )
  }
}
