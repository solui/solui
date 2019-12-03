# `@solui/styles`

Styling utilities for [solUI](https://solui.dev):

* Base theme and colour scheme for the website and [CLI frontend](https://solui.dev/docs/commandline).
* Layout utilities, including responsive breakpoints.
* Font management.
* Styling fragments for use with [styled components](https://emotion.sh/docs/styled).

## Installation

```shell
npm install @solui/styles
```

```shell
yarn add @solui/styles
```

## Example usage

Asynchronously loading and using fonts, along with theming system:

```js
const React = require('react')
const styled = require('@emotion/styled')
import { ThemeProvider } from 'emotion-theming'
const { loadFonts, getTheme } = require('@solui/styles')

const CustomDiv = styled.div`
  ${({ theme }) => theme.font('body')};
  color: ${({ theme  }) => theme.bodyTextColor};
`
export default class MyApp extends React.Component {
  componentDidMount () {
    if (typeof window !== 'undefined' && !!window.document) {
      loadFonts({
        body: {
          name: 'Roboto',
          weights: {
            thin: 100,
            regular: 400,
            bold: 700,
          },
        },
      }, window.document).then(
        () => this.forceUpdate(),
        err => console.error(err)
      )
    }
  }

  render () {
    return (
      <ThemProvider theme={getTheme()}>
        <CustomDiv>hello world!</CustomDiv>
      </ThemeProvider>
    )
  }
}
```

[Read full documentation](https://solui.dev/docs/packages/styles).

## License

Copyright 2019 solUI Contributors

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
