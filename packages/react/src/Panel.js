/* eslint-disable-next-line import/no-extraneous-dependencies */
import React, { useState, useCallback } from 'react'
import styled from '@emotion/styled'
import { flex, boxShadow, smoothTransitions } from '@solui/styles'

import { useExecutionHistory } from './hooks'
import AlertBox from './AlertBox'
import ErrorBox from './ErrorBox'
import PanelInputs from './PanelInputs'
import Image from './Image'
import { useInput } from './hooks'
import Result from './Result'
import Tx from './Tx'
import Icon from './Icon'
import Button from './Button'
import IconButton from './IconButton'
import ExecutionHistoryModal from './ExecutionHistoryModal'

const containerActiveCss = theme => `
  background-color: ${theme.panelActiveBgColor};
  border: 1px solid ${theme.panelActiveBorderColor};
  ${boxShadow({ color: theme.panelActiveShadowColor })};
`

const Container = styled.div`
  ${smoothTransitions()};
  background-color: ${({ theme }) => theme.panelBgColor};
  border: 1px solid ${({ theme }) => theme.panelBorderColor};
  ${({ expanded, theme }) => (expanded ? containerActiveCss(theme) : '')};
  border-radius: 5px;
  padding: 1rem;

  &:hover {
    ${({ theme }) => containerActiveCss(theme)};
  }
`

const Info = styled.div`
  ${flex({ direction: 'row', justify: 'flex-start' })}
  cursor: pointer;
`

const InfoText = styled.div`
  ${flex({ align: 'flex-start' })}
`

const Title = styled.h2`
  font-size: 1.5rem;
  margin: 0;
`

const Description = styled.p`
  font-size: 1.2rem;
  margin: 0.6rem 0 0;
  line-height: 1.2em;
`

const PanelImage = styled(Image)`
  width: 100px;
  min-width: 100px;
  height: auto;
  max-height: 100px;
  margin-right: 1rem;
`

const Content = styled.section`
  ${smoothTransitions()};
  max-height: ${({ expanded }) => (expanded ? 'auto' : '0')};
  margin-top: ${({ expanded }) => (expanded ? '2rem' : '0')};
  overflow: hidden;
`

const Actions = styled.div`
  margin-top: 1rem;
  ${flex({ direction: 'row', justify: 'space-between', align: 'center' })};
`

const StyledResult = styled(Result)`
  margin-top: 1rem;
  max-width: 100%;
`

const StyledTx = styled(Tx)`
  margin-top: 1rem;
  max-width: 100%;
`

const HistoryButton = styled(IconButton)`
  padding: 0.4em 0.5em;
  border: none;
`

/**
 * Render a UI panel.
 * @return {ReactElement}
 */
export const Panel = ({
  expanded,
  onClick,
  onExecute,
  onValidate,
  id: panelId,
  title,
  description,
  image,
  inputs
}) => {
  const [ tx, setTx ] = useState()
  const [ execResult, setExecResult ] = useState()
  const [ isExecuting, setIsExecuting ] = useState(false)
  const { executionHistory, saveExecutionToHistory } = useExecutionHistory()
  const [ executionHistoryModalIsShown, setShowExecutionHistoryModal ] = useState(false)

  const onClickContainer = useCallback(() => onClick(panelId), [ onClick, panelId ])

  const clearPreviousResults = useCallback(() => {
    setTx(null)
    setExecResult(null)
  }, [])

  const {
    inputValue,
    inputValidation,
    allInputsAreValid,
    onInputChange,
  } = useInput({
    inputs,
    validate: useCallback(panelInputs => {
      clearPreviousResults()
      return onValidate({ panelId, inputs: panelInputs })
    }, [
      panelId, onValidate
    ])
  })

  // execute
  const onExecutePanel = useCallback(async () => {
    if (!allInputsAreValid) {
      console.error('Please fix inputs')
      return
    }

    clearPreviousResults()
    setIsExecuting(true)

    const execHistoryItem = {
      inputs,
      inputValues: inputValue,
      successMsgs: [],
      failureMsgs: [],
    }

    try {
      const value = await onExecute({
        panelId,
        inputs: inputValue,
        executionProgressCallback: (progressType, obj) => {
          switch (progressType) {
            case 'tx':
              execHistoryItem.tx = obj
              setTx(obj)
              break
            case 'success':
              execHistoryItem.successMsgs.push(obj)
              break
            case 'failure':
              execHistoryItem.failureMsgs.push(obj)
              break
            default:
            // do nothing
          }
        }
      })
      setExecResult({ value, meta: execHistoryItem })
      saveExecutionToHistory({ ...execHistoryItem, outputValues: value })
    } catch (error) {
      setExecResult({ error, meta: execHistoryItem })
      saveExecutionToHistory({ ...execHistoryItem, error })
    } finally {
      setIsExecuting(false)
    }
  }, [ allInputsAreValid, onExecute, panelId, inputValue ])

  const toggleExecutionHistoryModal = useCallback(() => {
    setShowExecutionHistoryModal(!executionHistoryModalIsShown)
  }, [ executionHistoryModalIsShown ])

  const retryInputValues = useCallback(inputValues => {
    Object.keys(inputValues).forEach(k => {
      onInputChange[k](inputValues[k])
    })
    clearPreviousResults()
    setShowExecutionHistoryModal(false)
  })

  return (
    <Container expanded={expanded}>
      <Info onClick={onClickContainer}>
        {image ? <PanelImage {...image} /> : null}
        <InfoText>
          <Title>{title}</Title>
          {description ? <Description>{description}</Description> : null}
        </InfoText>
      </Info>
      <Content expanded={expanded}>
        {inputs.length ? (
          <PanelInputs
            inputs={inputs}
            inputValue={inputValue}
            inputValidation={inputValidation}
            onInputChange={onInputChange}
          />
        ) : null}

        <Actions>
          <Button
            onClick={isExecuting ? null : onExecutePanel}
            disabled={!allInputsAreValid}
          >
            {isExecuting ? <Icon name='laugh-squint' spin /> : 'Execute'}
          </Button>

          {(!isExecuting && !!executionHistory.length) ? (
            <HistoryButton title='View execution history' icon={{ name: 'history' }} onClick={toggleExecutionHistoryModal} />
          ) : null}

          <ExecutionHistoryModal
            history={executionHistory}
            open={executionHistoryModalIsShown}
            onClose={toggleExecutionHistoryModal}
            onRetry={retryInputValues}
          />
        </Actions>

        {execResult ? (
          <React.Fragment>
            <StyledResult result={execResult} />
          </React.Fragment>
        ) : null}

        {tx ? (
          <StyledTx tx={tx} />
        ) : null}

      </Content>
    </Container>
  )
}

export class PanelBuilder {
  constructor ({ id, attrs: { title, description, image } }) {
    this.attrs = { id, title, description, image }
    this.inputs = []
  }

  get id () {
    return this.attrs.id
  }

  processInput = async (id, name, config) => {
    this.inputs.push({ id, name, config })
  }

  buildContent (props) {
    return (
      <Panel
        inputs={this.inputs}
        {...this.attrs}
        {...props}
      />
    )
  }
}
