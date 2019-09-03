import React, { useCallback } from 'react'
import styled from '@emotion/styled'
import ReactTooltip from 'react-tooltip'
import * as clipboard from 'clipboard-polyfill'

import { openUrl } from '../utils/platform'
import IconButton from './IconButton'
import { GlobalContext } from '../_global'

const Span = styled.span``
const StyledIconButton = styled(IconButton)`
  margin-left: 0.5rem;
`

export default ({ value, type }) => {
  const copyToClipboard = useCallback(() => {
    clipboard.writeText(value)
  }, [ value ])

  const meta = (
    <StyledIconButton
      title='Copy to clipboard'
      icon={{ name: 'copy' }}
      onClick={copyToClipboard}
    />
  )

  let content

  switch (type) {
    case 'address':
      content = (
        <GlobalContext.Consumer>
          {({ network }) => {
            const etherscanLink = network.getEtherscanLink(value)

            const link = etherscanLink ? (
              <StyledIconButton
                title='View on Etherscan'
                icon={{ name: 'link' }}
                onClick={() => openUrl(etherscanLink)}
              />
            ) : null

            return (
              <>
                {meta}
                {link}
              </>
            )
          }}
        </GlobalContext.Consumer>
      )
      break
    default:
      content = meta
      // do nothing!
  }

  return (
    <>
      <ReactTooltip />
      <Span><Span>{value}</Span>{content}</Span>
    </>
  )
}
