import React, { useState, useCallback } from 'react'
import styled from '@emotion/styled'

import Inputs from './Inputs'
import { useInputHooks } from '../helpers/inputs'
import Result from './Result'

const Title = styled.h2`
  font-weight: bold;
  font-size: 1.5rem;
  margin-bottom: 1em;
`

export const Panel = ({ onExecute, onValidate, id: panelId, config, inputs }) => {
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
    <div>
      <Title>{config.title}</Title>

      {inputs.length ? (
        <Inputs
          inputs={inputs}
          inputValue={inputValue}
          inputValidation={inputValidation}
          onInputChange={onInputChange}
        />
      ) : null}

      <button onClick={onExecutePanel} disabled={isExecuting || !allInputsAreValid}>
        Execute
      </button>

      {execResult ? (
        <Result result={execResult} config={config.output} />
      ) : null}
    </div>
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

  buildContent (callbacks) {
    return (
      <Panel
        {...this.attrs}
        {...callbacks}
      />
    )
  }
}
