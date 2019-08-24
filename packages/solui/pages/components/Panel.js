import React, { useCallback, useReducer, useMemo } from 'react'
import styled from '@emotion/styled'

import Input from './Input'
import { GlobalContext } from '../_global'

const Title = styled.h2`
  font-weight: bold;
  font-size: 1.5rem;
  margin-bottom: 1em;
`

const inputStateReducer = (state, { id, ...toUpdate }) => ({
  ...state,
  [id]: { ...state[id], ...toUpdate },
})

// initial reducer state
const createInitialInputState = inputs => inputs.reduce((m, { id, config: { initialValue } }) => {
  m[id] = { value: initialValue || '', valid: true }
  return m
}, {})

export const Panel = ({ title, inputs }) => {
  // reducer
  const [ inputState, updateInputState ] = useReducer(
    inputStateReducer, inputs, createInitialInputState
  )

  // input change handlers
  const { setValidationResult, onChange } = useMemo(() => {
    const changeHandlers = inputs.reduce((m, { id }) => {
      m[id] = value => updateInputState({ id, value })
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


  // execute handler
  const onExecute = useCallback(() => {
    if (allInputsValid) {
      console.log(inputState)
    }
  }, [ allInputsValid, inputState ])

  return (
    <div>
      <Title>{title}</Title>
      <GlobalContext.Consumer>
        {({ network }) => inputs.map(({ id, config }) => (
          <Input
            key={id}
            id={id}
            onChange={onChange[id]}
            setValidationResult={setValidationResult[id]}
            config={config}
            network={network}
            {...inputState[id]}
          />
        ))}
      </GlobalContext.Consumer>

      <button onClick={onExecute} disabled={!allInputsValid}>
        Execute
      </button>
    </div>
  )
}

export class PanelBuilder {
  constructor (id, config) {
    this.id = id
    this.title = config.title
    this.inputs = []
    this.execSteps = []
  }

  addInput (id, config) {
    this.inputs.push({ id, config })
  }

  addExecutionStep (config) {
    this.execSteps.push(config)
  }

  buildContent () {
    return (
      <Panel
        title={this.title}
        inputs={this.inputs}
        execSteps={this.execSteps}
      />
    )
  }
}
