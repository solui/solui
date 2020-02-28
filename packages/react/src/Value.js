/* eslint-disable-next-line import/no-extraneous-dependencies */
import React, { Fragment, useState, useCallback, useMemo } from 'react'
import styled from '@emotion/styled'

import { openUrl, getRenderableValuesForOutput } from './utils'
import LinkButton from './LinkButton'
import IconButton from './IconButton'
import CopyToClipboardButton from './CopyToClipboardButton'
import { NetworkContext } from './contexts'

const Container = styled.span`
  display: inline-block;
`

const Val = styled.span`
  word-break: break-word;
`

const BytesVal = styled(Val)`
  word-break: break-all;
`

const StyledIconButton = styled(IconButton)`
  margin-left: 0.5rem;
`

const StyledCopyToClipboardButton = styled(CopyToClipboardButton)`
  margin-left: 0.5rem;
`

/**
 * Render a single value.
 *
 * @return {ReactElement}
 */
const SingleValue = ({ value, ...config }) => {
  const { type } = config

  const [ currentValueFormatIndex, setCurrentValueFormatIndex ] = useState(0)

  const valueFormats = useMemo(() => {
    return getRenderableValuesForOutput({ value, type, config })
  }, [ value, type, config ])

  const hasMoreThanOneValueFormat = useMemo(() => valueFormats.length > 1, [ valueFormats ])

  const valueFormatToRender = useMemo(() => {
    const idx = (currentValueFormatIndex >= valueFormats.length) ? 0 : currentValueFormatIndex
    return valueFormats[idx]
  }, [ currentValueFormatIndex, valueFormats ])

  const showNextValueFormat = useCallback(() => {
    const idx = (currentValueFormatIndex >= valueFormats.length - 1) ? 0 : currentValueFormatIndex + 1
    setCurrentValueFormatIndex(idx)
  }, [ currentValueFormatIndex, valueFormats ])

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

  const Comp = (type.startsWith('bytes32') ? BytesVal : Val)

  return (
    <Container>
      {hasMoreThanOneValueFormat ? (
        <LinkButton title="Change format" onClick={showNextValueFormat}>{valueFormatToRender}</LinkButton>
      ) : (
        <Comp>{ valueFormatToRender }</Comp>
      )}
      {postValueContent}
    </Container>
  )
}

const ArrayContainer = styled.div`
  display: block;
  max-height: 200px;
  overflow: scroll;

  & > span {
    margin-bottom: 1rem;

    &:last-child {
      margin-bottom: 0;
    }
  }
`

const ArrayValue = ({ value, ...config }) => {
  return (
    <ArrayContainer>
      {value.map((v, i) => {
        return (
          <SingleValue key={i} value={v} {...config} />
        )
      })}
    </ArrayContainer>
  )
}

const Value = ({ value, ...config }) => {
  if (Array.isArray(value)) {
    return <ArrayValue value={value} {...config} />
  } else {
    return <SingleValue value={value} {...config} />
  }
}

export default Value
