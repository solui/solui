import React, { useState, useCallback } from 'react'
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
      title={copyButtonTooltip}
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
