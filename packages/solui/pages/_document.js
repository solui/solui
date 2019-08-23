import Document, { Main, Head, NextScript } from 'next/document'
import { APP_STATE_KEYS } from '../src/frontend'

export default class MyDocument extends Document {
  static async getInitialProps (ctx) {
    const initialProps = await Document.getInitialProps(ctx)

    const ret = { ...initialProps }

    APP_STATE_KEYS.forEach(k => {
      ret[k] = ctx.res[k]
    })

    return ret
  }

  render () {
    const appState = APP_STATE_KEYS.reduce((m, key) => {
      m[key] = this.props[key]
      return m
    }, {})

    return (
      <html lang="en">
        <Head>
          <meta charSet="utf-8" />
          <meta httpEquiv="X-UA-Compatible" content="IE=edge,chrome=1"/>
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1, shrink-to-fit=no, maximum-scale=1, user-scalable=no"
          />
          <script type="text/javascript" dangerouslySetInnerHTML={{
            __html: `
              window.APP_STATE = ${JSON.stringify(appState, null, 2)};
            `
          }}></script>
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </html>
    )
  }
}
