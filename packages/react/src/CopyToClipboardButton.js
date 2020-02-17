/* eslint-disable-next-line import/no-extraneous-dependencies */
import React, { useState, useCallback } from 'react'
import styled from '@emotion/styled'
import * as clipboard from 'clipboard-polyfill'
import ReactTooltip from 'react-tooltip'

import IconButton from './IconButton'

const Container = styled.span``

const COPY_TO_CLIPBOARD = 'Copy to clipboard'

/**
 * Copy-to-clipboard button.
 *
 * @return {ReactElement}
 */
const CopyToClipboardButton = ({ value, className }) => {
  const [ copyButtonTooltip, setCopyButtonTooltip ] = useState(COPY_TO_CLIPBOARD)

  const copyToClipboard = useCallback(() => {
    clipboard.writeText(value)
    setCopyButtonTooltip('Copied!')
    setTimeout(() => setCopyButtonTooltip(COPY_TO_CLIPBOARD), 5000)
  }, [value ])

  return (
    <Container className={className}>
      <ReactTooltip />
      <IconButton
        tooltip={copyButtonTooltip}
        icon={{ name: 'copy' }}
        onClick={copyToClipboard}
      />
    </Container>
  )
}

export default CopyToClipboardButton
