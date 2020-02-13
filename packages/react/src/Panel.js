/* eslint-disable-next-line import/no-extraneous-dependencies */
import React, { useState, useCallback } from 'react'
import styled from '@emotion/styled'
import { flex, boxShadow, smoothTransitions } from '@solui/styles'

import PanelInputs from './PanelInputs'
import Image from './Image'
import { useInput } from './hooks'
import Result from './Result'
import Tx from './Tx'
import Icon from './Icon'
import Button from './Button'

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

const StyledButton = styled(Button)`
  margin-top: 1rem;
`

const StyledResult = styled(Result)`
  margin-top: 1rem;
  max-width: 100%;
`

const StyledTx = styled(Tx)`
  margin-top: 1rem;
  max-width: 100%;
  word-break: break-all;
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

  const executionProgressCallback = useCallback((progressType, obj) => {
    switch (progressType) {
      case 'tx':
        setTx(obj)
        break
      default:
        // do nothing
    }
  }, [])

  const onClickContainer = useCallback(() => onClick(panelId), [ onClick, panelId ])

  const {
    inputValue,
    inputValidation,
    allInputsAreValid,
    onInputChange,
  } = useInput({
    inputs,
    validate: useCallback(panelInputs => onValidate({ panelId, inputs: panelInputs }), [
      panelId, onValidate
    ])
  })

  // execute
  const onExecutePanel = useCallback(async () => {
    if (!allInputsAreValid) {
      console.error('Please fix inputs')
      return
    }

    setTx(null)
    setExecResult(null)
    setIsExecuting(true)

    try {
      const value = await onExecute({ panelId, inputs: inputValue, executionProgressCallback })
      setExecResult({ value })
    } catch (error) {
      setExecResult({ error })
    } finally {
      setIsExecuting(false)
    }
  }, [ allInputsAreValid, onExecute, panelId, inputValue, executionProgressCallback ])

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

        <StyledButton
          onClick={isExecuting ? null : onExecutePanel}
          disabled={!allInputsAreValid}
        >
          {isExecuting ? <Icon name='laugh-squint' spin /> : 'Execute'}
        </StyledButton>

        {execResult ? (
          <StyledResult result={execResult} />
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
