import React, { useState, useCallback, useReducer, useMemo } from 'react'
import styled from '@emotion/styled'

import Input from './Input'
import Result from './Result'
import { GlobalContext } from '../_global'

const Title = styled.h2`
  font-weight: bold;
  font-size: 1.5rem;
  margin-bottom: 1em;
`

const inputStateReducer = (state, { id, ...toUpdate }) => ({
  ...state,
  // we will update different properties at different times, hence overwrite only what's changed
  [id]: { ...state[id], ...toUpdate },
})

// initial reducer state
const createInitialInputState = inputs => inputs.reduce((m, { id, config: { initialValue } }) => {
  m[id] = { value: initialValue || '', valid: true }
  return m
}, {})

export const Panel = ({ onRun, id: panelId, config, inputs }) => {
  const [ execResult, setExecResult ] = useState()

  // reducer
  const [ inputState, updateInputState ] = useReducer(
    inputStateReducer, inputs, createInitialInputState
  )

  // input change handlers
  // setValidationResult() will typically get called after onChange()
  const { setValidationResult, onChange } = useMemo(() => {
    const changeHandlers = inputs.reduce((m, { id }) => {
      m[id] = value => {
        setExecResult(null)
        updateInputState({ id, value })
      }
      return m
    }, {})

    const validationResultSetters = inputs.reduce((m, { id }) => {
      m[id] = (valid, error) => updateInputState({ id, valid, error })
      return m
    }, {})

    return { setValidationResult: validationResultSetters, onChange: changeHandlers }
  }, [ updateInputState, inputs ])

  // check input validity
  const allInputsValid = useMemo(() => (
    Object.values(inputState).reduce((m, { valid }) => m && valid, true)
  ), [ inputState ])

  // execute it!
  const onExecute = useCallback(() => {
    if (!allInputsValid) {
      console.error('Please fix inputs')
      return
    }

    setExecResult(null)

    onRun({
      panelId,
      inputs: Object.keys(inputState).reduce((m, k) => {
        m[k] = inputState[k].value
        return m
      }, {})
    })
      .then(value => setExecResult({ value }))
      .catch(error => setExecResult({ error }))
  }, [ onRun, allInputsValid, panelId, inputState ])

  return (
    <div>
      <Title>{config.title}</Title>
      <GlobalContext.Consumer>
        {({ network }) => inputs.map(({ id, config: inputConfig }) => (
          <Input
            key={id}
            id={id}
            onChange={onChange[id]}
            setValidationResult={setValidationResult[id]}
            config={inputConfig}
            network={network}
            {...inputState[id]}
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
  constructor ({ id, config, onRun }) {
    this.attrs = {
      id,
      config,
      onRun,
      inputs: [],
    }
  }

  get id () {
    return this.attrs.id
  }

  addInput (id, config) {
    this.attrs.inputs.push({ id, config })
  }

  buildContent () {
    return (
      <Panel {...this.attrs} key={this.attrs.id} />
    )
  }
}
