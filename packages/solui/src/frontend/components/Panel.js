import React, { useState, useCallback } from 'react'
import styled from '@emotion/styled'

import Inputs from './Inputs'
import { useInputHooks } from '../hooks/inputs'
import Result from './Result'
import Button from './Button'
import { roboto } from '../styles/fonts'

const Container = styled.div`
  padding: 1rem;
`

const Title = styled.h3`
  ${roboto('bold')}
  font-size: 1.1rem;
  margin: 0 0 2rem;
`

export const Panel = ({
  className,
  onExecute,
  onValidate,
  canExecute,
  id: panelId,
  config,
  inputs
}) => {
  const [ execResult, setExecResult ] = useState()
  const [ isExecuting, setIsExecuting ] = useState(false)

  const {
    inputValue,
    inputValidation,
    allInputsAreValid,
    onInputChange,
  } = useInputHooks({
    inputs,
    validate: useCallback(panelInputs => onValidate(panelId, panelInputs), [
      panelId, onValidate
    ])
  })

  // execute
  const onExecutePanel = useCallback(async () => {
    if (!allInputsAreValid) {
      console.error('Please fix inputs')
      return
    }

    setExecResult(null)
    setIsExecuting(true)

    try {
      const value = await onExecute(panelId, inputValue)
      setExecResult({ value })
    } catch (error) {
      setExecResult({ error })
    } finally {
      setIsExecuting(false)
    }
  }, [ allInputsAreValid, onExecute, panelId, inputValue ])

  return (
    <Container className={className}>
      <Title>{config.title}</Title>

      {inputs.length ? (
        <Inputs
          inputs={inputs}
          inputValue={inputValue}
          inputValidation={inputValidation}
          onInputChange={onInputChange}
        />
      ) : null}

      <Button onClick={onExecutePanel} disabled={isExecuting || !canExecute || !allInputsAreValid}>
        Execute
      </Button>

      {execResult ? (
        <Result result={execResult} config={config.output} />
      ) : null}
    </Container>
  )
}

export class PanelBuilder {
  constructor ({ id, config }) {
    this.attrs = {
      id,
      config,
      inputs: [],
    }
  }

  get id () {
    return this.attrs.id
  }

  addInput (id, name, config) {
    this.attrs.inputs.push({ id, name, config })
  }

  buildContent (props) {
    return (
      <Panel
        {...this.attrs}
        {...props}
      />
    )
  }
}
