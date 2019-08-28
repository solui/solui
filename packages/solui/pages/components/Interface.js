import React, { useCallback } from 'react'
import styled from '@emotion/styled'

import { PanelBuilder } from './Panel'
import Inputs from './Inputs'
import { useInputHooks } from '../helpers/inputs'

const Id = styled.h1`
  font-size: 2rem;
  margin-bottom: 0.5em;
`

const Description = styled.p`
  font-size: 1.2rem;
  margin: 0 2rem;
`

const PanelContainer = styled.li`
  display: block;
  border: 1px solid ${({ theme }) => theme.panelBorderColor};
  padding: 1rem;
  margin-bottom: 1rem;
`

export const Interface = ({
  onExecutePanel,
  onValidateTopLevelInputs,
  onValidatePanel,
  id,
  description,
  inputs,
  panels
}) => {
  const {
    inputValue,
    inputValidation,
    allInputsAreValid,
    onInputChange,
  } = useInputHooks({
    inputs,
    validate: useCallback(rootInputs => {
      return onValidateTopLevelInputs({ inputs: rootInputs })
    }, [
      onValidateTopLevelInputs
    ])
  })

  // execute panel
  const onExecute = useCallback(async (panelId, panelInputs) => {
    if (!allInputsAreValid) {
      console.error('Please fix inputs')
      return
    }

    const combinedInputs = {
      ...inputValue,
      ...panelInputs,
    }

    await onExecutePanel({ panelId, inputs: combinedInputs })
  }, [ inputValue, allInputsAreValid, onExecutePanel ])

  // validate panel
  const onValidate = useCallback(async (panelId, panelInputs) => {
    const combinedInputs = {
      ...inputValue,
      ...panelInputs,
    }

    await onValidatePanel({ panelId, inputs: combinedInputs })
  }, [ inputValue, onValidatePanel ])

  return (
    <div>
      <Id>{id}</Id>
      <Description>{description}</Description>

      {inputs.length ? (
        <Inputs
          inputs={inputs}
          inputValue={inputValue}
          inputValidation={inputValidation}
          onInputChange={onInputChange}
        />
      ) : null}

      {panels.map(panel => (
        <PanelContainer key={panel.id}>
          {panel.buildContent({
            onExecute,
            onValidate,
          })}
        </PanelContainer>
      ))}
    </div>
  )
}

export class InterfaceBuilder {
  constructor (callbacks) {
    this.inputs = []
    this.callbacks = callbacks
    this.panels = []
    this.currentPanel = null
  }

  startUi = (id, description) => {
    this.attrs = { id, description }
  }

  endUi = () => {}

  getInput = (id, name, config) => {
    if (this.currentPanel) {
      this.currentPanel.addInput(id, name, config)
    } else {
      this.inputs.push({ id, name, config })
    }
  }

  startPanel = (id, name, config) => {
    this.currentPanel = new PanelBuilder({ id, config })
  }

  endPanel = () => {
    this.panels.push(this.currentPanel)
    this.currentPanel = null
  }

  buildContent () {
    return (
      <Interface
        inputs={this.inputs}
        panels={this.panels}
        {...this.attrs}
        {...this.callbacks}
      />
    )
  }
}
