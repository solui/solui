import React, { useCallback, useReducer, useMemo } from 'react'
import styled from '@emotion/styled'

import Input from './Input'

const Title = styled.h2`
  font-weight: bold;
  font-size: 1.5rem;
  margin-bottom: 1em;
`

const inputStateReducer = (state, action) => ({ ...state, [action.id]: action.value })

// initial reducer state
const createInitialInputState = inputs => inputs.reduce((m, { id }) => {
  m[id] = ''
  return m
}, {})

export const Panel = ({ title, inputs }) => {
  // reducer
  const [ inputState, updateInputState ] = useReducer(
    inputStateReducer, inputs, createInitialInputState
  )

  // input change handlers
  const onInputChange = useMemo(() => inputs.reduce((m, { id }) => {
    m[id] = value => updateInputState({ id, value })
    return m
  }, {}), [ updateInputState, inputs ])

  // execute handler
  const onExecute = useCallback(() => {
    console.log(inputState)
  }, [ inputState ])

  return (
    <div>
      <Title>{title}</Title>
      {inputs.map(({ id, config }) => (
        <Input
          key={id}
          id={id}
          onChange={onInputChange[id]}
          value={inputState[id]}
          config={config}
        />
      ))}
      <button onClick={onExecute}>Execute</button>
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

  getRenderedContent () {
    return <Panel title={this.title} inputs={this.inputs} execSteps={this.execSteps} />
  }
}
