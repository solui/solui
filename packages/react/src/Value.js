/* eslint-disable-next-line import/no-extraneous-dependencies */
import React, { Fragment, useState, useCallback, useMemo } from 'react'
import styled from '@emotion/styled'
import * as clipboard from 'clipboard-polyfill'
import ReactTooltip from 'react-tooltip'

import { openUrl, getRenderableValuesForOutput } from './utils'
import IconButton from './IconButton'
import LinkButton from './LinkButton'
import { NetworkContext } from './contexts'

const Span = styled.span``

const StyledIconButton = styled(IconButton)`
  margin-left: 0.5rem;
`

const COPY_TO_CLIPBOARD = 'Copy to clipboard'

/**
 * Render a raw value.
 *
 * This will additionally render a button to copy the value to the clipboard.
 *
 * @return {ReactElement}
 */
const Value = ({ value, ...config }) => {
  const { type } = config

  const [ copyButtonTooltip, setCopyButtonTooltip ] = useState(COPY_TO_CLIPBOARD)
  const [ currentValueFormatIndex, setCurrentValueFormatIndex ] = useState(0)

  const valueFormats = useMemo(() => {
    return getRenderableValuesForOutput({ value, type, config })
  }, [ value, type, config ])

  const hasMoreThanOneValueFormat = useMemo(() => valueFormats.length > 1, [ valueFormats ])

  const valueFormatToRender = useMemo(() => {
    if (currentValueFormatIndex >= valueFormats.length) {
      currentValueFormatIndex = 0;
    }
    return valueFormats[currentValueFormatIndex]
  }, [currentValueFormatIndex, valueFormats ])

  const showNextValueFormat = useCallback(() => {
    setCurrentValueFormatIndex(currentValueFormatIndex >= valueFormats.length - 1 ? 0 : currentValueFormatIndex + 1)
  }, [ currentValueFormatIndex , valueFormats ])

  const copyToClipboard = useCallback(() => {
    clipboard.writeText(valueFormatToRender)
    setCopyButtonTooltip('Copied!')
    setTimeout(() => setCopyButtonTooltip(COPY_TO_CLIPBOARD), 5000)
  }, [ valueFormatToRender ])

  const actions = (
    <StyledIconButton
      tooltip={copyButtonTooltip}
      icon={{ name: 'copy' }}
      onClick={copyToClipboard}
    />
  )

  let postValueContent

  switch (type) {
    case 'address':
    case 'txHash':
      postValueContent = (
        <NetworkContext.Consumer>
          {({ network }) => {
            const etherscanLink = network ? network.getEtherscanLink(valueFormatToRender) : null

            const link = etherscanLink ? (
              <StyledIconButton
                tooltip='View on Etherscan'
                icon={{ name: 'link' }}
                onClick={() => openUrl(etherscanLink)}
              />
            ) : null

            return (
              <Fragment>{actions}{link}</Fragment>
            )
          }}
        </NetworkContext.Consumer>
      )
      break
    default:
      postValueContent = actions
  }

  return (
    <Fragment>
      <ReactTooltip />
      <Span>
        {hasMoreThanOneValueFormat ? (
          <LinkButton title="Change format" onClick={showNextValueFormat}>{valueFormatToRender}</LinkButton>
        ): (
          <Span>{ valueFormatToRender }</Span>
        )}
        {postValueContent}
      </Span>
    </Fragment>
  )
}

export default Value
