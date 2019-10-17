/* eslint-disable-next-line import/no-extraneous-dependencies */
import React, { useState, useCallback } from 'react'
import styled from '@emotion/styled'
import ReactTooltip from 'react-tooltip'
import * as clipboard from 'clipboard-polyfill'

import { openUrl } from './utils'
import IconButton from './IconButton'
import { NetworkContext } from './contexts'

const Span = styled.span``
const StyledIconButton = styled(IconButton)`
  margin-left: 0.5rem;
`

const COPY_TO_CLIPBOARD = 'Copy to clipboard'

export default ({ value, type }) => {
  const [ copyButtonTooltip, setCopyButtonTooltip ] = useState(COPY_TO_CLIPBOARD)

  const copyToClipboard = useCallback(() => {
    clipboard.writeText(value)
    setCopyButtonTooltip('Copied!')
    setTimeout(() => setCopyButtonTooltip(COPY_TO_CLIPBOARD), 5000)
  }, [ value ])

  const meta = (
    <StyledIconButton
      tooltip={copyButtonTooltip}
      icon={{ name: 'copy' }}
      onClick={copyToClipboard}
    />
  )

  let content

  switch (type) {
    case 'address':
      content = (
        <NetworkContext.Consumer>
          {({ network }) => {
            const etherscanLink = network ? network.getEtherscanLink(value) : null

            const link = etherscanLink ? (
              <StyledIconButton
                tooltip='View on Etherscan'
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
        </NetworkContext.Consumer>
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
