import React, { useCallback } from 'react'
import styled from '@emotion/styled'
import ReactTooltip from 'react-tooltip'
import * as clipboard from 'clipboard-polyfill'

import IconButton from './IconButton'
import { GlobalContext } from '../_global'

const Span = styled.span``

export default ({ value, type }) => {
  const meta = (
    <IconButton title='Copy to clipboard' icon={{ name: 'copy' }} />
  )

  const val = <Span>{value}</Span>

  let content

  switch (type) {
    case 'address':
      content = (
        <GlobalContext.Consumer>
          {({ network }) => (
            <Span>{val}{meta}<Span>{network.id}</Span></Span>
          )}
        </GlobalContext.Consumer>
      )
      break
    default:
      content = (
        <Span>
          {val}
          {meta}
        </Span>
      )
  }

  return (
    <>
      <ReactTooltip />
      {content}
    </>
  )
}
