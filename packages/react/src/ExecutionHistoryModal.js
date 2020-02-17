/* eslint-disable-next-line import/no-extraneous-dependencies */
import React, { Fragment, useState, useCallback } from 'react'
import styled from '@emotion/styled'
import { flex } from '@solui/styles'
import { prettyDate } from '@solui/utils'

import { Modal } from './Modal'
import Result from './Result'
import Tx from './Tx'
import Icon from './Icon'
import Button from './Button'
import IconButton from './IconButton'
import CopyToClipboardButton from './CopyToClipboardButton'

const ModalContainer = styled.div`
  ${flex({ direction: 'column', justify: 'flex-start', align: 'flex-start' })};
  ${({ theme }) => theme.font('body')};
  width: 100%;
  height: 100%;
  overflow: scroll;

  h2 {
    margin-top: 0;
  }
`

const NoneYet = styled.div`
  font-size: 1rem;
  ${({ theme }) => theme.font('body', 'normal', 'italic')};
  color: ${({ theme }) => theme.execHistoryMetaTextColor};
`

const ItemContainer = styled.div`
  ${flex({ direction: 'row', justify: 'flex-start', align: 'flex-start' })};
  width: 100%;
  flex: 0;
`

const ToggleButton = styled(IconButton)`
  border: 0;
  padding: 0.5rem;
  margin: 0.3rem 0.2rem 0 0;
  flex: 0;
`

const Item = styled.div`
  position: relative;
  flex: 1;
  margin-bottom: 1rem;
  border: 1px dashed ${({ theme, passed }) => (
    passed ? theme.execHistorySuccessBorderColor : theme.execHistoryFailureBorderColor
  )};
  background-color: ${({ theme, passed }) => (
    passed ? theme.execHistorySuccessBgColor : theme.execHistoryFailureBgColor
  )};
  border-radius: 5px;
  padding: 1rem;

  & > h3 {
    ${({ theme }) => theme.font('header')};
    margin-top: 0;
  }
`

const InputList = styled.ul`
  margin-bottom: 2rem;

  li {
    line-height: 2em;
  }
  `

const ItemDate = styled.div`
  color: ${({ theme }) => theme.execHistoryMetaTextColor};
  position: absolute;
  right: 1rem;
  top: 1rem;
`

const InputName = styled.span`
  ${({ theme }) => theme.font('body', 'bold')};
  margin-right: 0.5rem;
`

const InputValue = styled.span`
  margin-right: 0.5rem;
`

const StyledResult = styled(Result)`
  font-size: 0.9rem;
`

const StyledTx = styled(Tx)`
  max-width: 100%;
`

const StyledButton = styled(Button)`
  margin-top: 2rem;
`

const HistoryItem = ({ onRetry, item: { ts, inputs, inputValues, outputValues, tx, error } }) => {
  const [ expanded, setExpanded ] = useState(false)

  const toggleExpanded = useCallback(() => {
    setExpanded(!expanded)
  }, [ expanded ])

  const doRetry = useCallback(() => {
    onRetry(inputValues)
  }, [ inputValues, onRetry ])

  const rightContent = (
    <Item passed={!error}>
      <ItemDate title='Time of execution'>
        <Icon name='clock' /> {prettyDate(ts, 'HH:mm')}
      </ItemDate>
      {expanded ? (
        <Fragment>
          <h3>Input</h3>
          <InputList>
            {inputs.map(i => (
              <li>
                <InputName>{i.config.title}:</InputName>
                <InputValue>{inputValues[i.id]}</InputValue>
                <CopyToClipboardButton value={inputValues[i.id]} />
              </li>
            ))}
          </InputList>
          <h3>Result</h3>
          <StyledResult result={{ value: outputValues, error }} />
          {tx ? <StyledTx tx={tx} /> : null}
          <StyledButton onClick={doRetry}>Retry</StyledButton>
        </Fragment>
      ) : (
        <Fragment>
          <div>Result: {error ? 'FAILURE' : 'SUCCESS'}</div>
        </Fragment>
      )}
    </Item>
  )

  return (
    <ItemContainer>
      <ToggleButton onClick={toggleExpanded} icon={{ icon: expanded ? 'minus' : 'plus' }} />
      {rightContent}
    </ItemContainer>
  )
}

const ExecutionHistoryModal = ({ open, history, onClose, onRetry }) => {
  const latestFirst = [].concat(history).reverse()

  return (
    <Modal isOpen={open} width='80%' height='80%' onBackgroundClick={onClose}>
      <ModalContainer>
        <h2>Previous executions</h2>
        {latestFirst.length ? (
          latestFirst.map(h => <HistoryItem key={h.ts} onRetry={onRetry} item={h} />)
        ): (
          <NoneYet>None yet :/</NoneYet>
        )}
      </ModalContainer>
    </Modal>
  )
}

export default ExecutionHistoryModal
