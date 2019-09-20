/* eslint-disable-next-line import/no-extraneous-dependencies */
import React from 'react'
import { css, Global } from '@emotion/core'
import { useTheme } from 'emotion-theming'
import { resetStyles } from '@solui/styles'

export default () => {
  const theme = useTheme()

  return (
    <>
      <Global styles={resetStyles}/>
      <Global styles={css`
        * {
          box-sizing: border-box;
        }

        html {
          ${theme.font('body')};
          font-size: 14px;
        }

        a {
          cursor: pointer;
          text-decoration: none;
          border-bottom: 1px solid transparent;
          transition: all 0.3s;
        }

        h1, h2, h3 {
          ${theme.font('header')};
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
      `}/>
    </>
  )
}
