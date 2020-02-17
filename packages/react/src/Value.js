/* eslint-disable-next-line import/no-extraneous-dependencies */
import React, { Fragment, useState, useCallback, useMemo } from 'react'
import styled from '@emotion/styled'

import { openUrl, getRenderableValuesForOutput } from './utils'
import LinkButton from './LinkButton'
import CopyToClipboardButton from './CopyToClipboardButton'
import { NetworkContext } from './contexts'

const Span = styled.span``

const StyledCopyToClipboardButton = styled(CopyToClipboardButton)`
  margin-left: 0.5rem;
`

/**
 * Render a raw value.
 *
 * @return {ReactElement}
 */
const Value = ({ value, ...config }) => {
  const { type } = config

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

  const actions = (
    <StyledCopyToClipboardButton value={valueFormatToRender} />
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
    <Span>
      {hasMoreThanOneValueFormat ? (
        <LinkButton title="Change format" onClick={showNextValueFormat}>{valueFormatToRender}</LinkButton>
      ): (
        <Span>{ valueFormatToRender }</Span>
      )}
      {postValueContent}
    </Span>
  )
}

export default Value
