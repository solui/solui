import { css } from '@emotion/core'

import { openSans, roboto } from './fonts'

export const baseStyles = css`
  * {
    box-sizing: border-box;
  }

  html {
    ${openSans()};
    font-size: 14px;
  }

  a {
    cursor: pointer;
    text-decoration: none;
    border-bottom: 1px solid transparent;
    transition: all 0.3s;
  }

  h1, h2, h3 {
    ${roboto()};
    margin: 1em 0;
    font-weight: bolder;
    line-height: 1em;
  }

  h1 {
    font-size: 2.1rem;
    margin: 1rem 0 0;
  }

  h2 {
    font-size: 1.5rem;
  }

  h3 {
    font-size: 1.2rem;
  }
`
