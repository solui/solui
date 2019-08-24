import React, { useState, useEffect, useCallback, useReducer, useMemo } from 'react'
import styled from '@emotion/styled'

import Input from './Input'
import Result from './Result'
import { GlobalContext } from '../_global'
import { _, createErrorWithDetails } from '../../src/utils'

const Title = styled.h2`
  font-weight: bold;
  font-size: 1.5rem;
  margin-bottom: 1em;
`

const inputValueReducer = (state, { id, value }) => {
  if (state[id] !== value) {
    return { ...state, [id]: value }
  } else {
    return state
  }
}

const inputValidationReducer = (state, { id, valid, error }) => {
  if (state[id].valid !== valid) {
    return { ...state, [id]: { valid, error } }
  } else {
    return state
  }
}


// initial reducer states
const createInitialInputValueState = inputs => (
  inputs.reduce((m, { id, config: { initialValue } }) => {
    m[id] = initialValue || ''
    return m
  }, {})
)

const createInitialInputValidationState = inputs => (
  inputs.reduce((m, { id }) => {
    m[id] = { valid: false }
    return m
  }, {})
)

export const Panel = ({ onRun, onValidate, id: panelId, config, inputs }) => {
  const [ execResult, setExecResult ] = useState()

  // reducers
  const [ inputValue, updateInputValue ] = useReducer(
    inputValueReducer, inputs, createInitialInputValueState
  )
  const [ inputValidation, updateInputValidation ] = useReducer(
    inputValidationReducer, inputs, createInitialInputValidationState
  )

  // input change handlers
  const onChange = useMemo(() => (
    inputs.reduce((m, { id }) => {
      m[id] = value => {
        setExecResult(null)
        updateInputValue({ id, value })
      }
      return m
    }, {})
  ), [ updateInputValue, inputs ])

  // check input validity
  const allInputsValid = useMemo(() => (
    Object.values(inputValidation).reduce((m, { valid }) => m && valid, true)
  ), [ inputValidation ])

  // execute it!
  const onExecute = useCallback(() => {
    if (!allInputsValid) {
      console.error('Please fix inputs')
      return
    }

    setExecResult(null)

    onRun({
      panelId,
      inputs: inputValue,
    })
      .then(value => setExecResult({ value }))
      .catch(error => setExecResult({ error }))
  }, [ onRun, allInputsValid, panelId, inputValue ])

  // validation takes place asynchronously
  useEffect(() => {
    (async () => {
      let errorDetails = {}

      try {
        await onValidate({
          panelId,
          inputs: inputValue,
        })
      } catch (err) {
        errorDetails = _.get(err, 'details', {})
      }

      // update validation results for all inputs
      Object.keys(inputValidation).forEach(inputId => {
        if (errorDetails[inputId]) {
          updateInputValidation({ id: inputId, valid: false, error: errorDetails[inputId] })
        } else {
          updateInputValidation({ id: inputId, valid: true })
        }
      })
    })()
  }, [ panelId, onValidate, inputValue, inputValidation, updateInputValidation ])


  return (
    <div>
      <Title>{config.title}</Title>
      <GlobalContext.Consumer>
        {({ network }) => inputs.map(({ id, name, config: inputConfig }) => (
          <Input
            key={id}
            name={name}
            onChange={onChange[id]}
            config={inputConfig}
            network={network}
            value={inputValue[id]}
            valid={inputValidation[id].valid}
            error={inputValidation[id].error}
          />
        ))}
      </GlobalContext.Consumer>

      <button onClick={onExecute} disabled={!allInputsValid}>
        Execute
      </button>

      {execResult ? (
        <Result result={execResult} config={config.output} />
      ) : null}
    </div>
  )
}

export class PanelBuilder {
  constructor ({ id, config, onRun, onValidate }) {
    this.attrs = {
      id,
      config,
      onRun,
      onValidate,
      inputs: [],
    }
  }

  get id () {
    return this.attrs.id
  }

  addInput (id, name, config) {
    this.attrs.inputs.push({ id, name, config })
  }

  buildContent () {
    return (
      <Panel {...this.attrs} key={this.id} />
    )
  }
}
