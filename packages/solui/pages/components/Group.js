import React, { useCallback } from 'react'
import styled from '@emotion/styled'

import { PanelBuilder } from './Panel'
import Inputs from './Inputs'
import { useInputHooks } from '../helpers/inputs'

const Id = styled.h1`
  font-size: 2rem;
  margin-bottom: 0.5em;
`

const Title = styled.p`
  font-size: 1.2rem;
  margin: 0 2rem;
`

const PanelContainer = styled.div`
  border: 1px solid ${({ theme }) => theme.panelBorderColor};
  padding: 1rem;
  margin-bottom: 1rem;
`

export const Group = ({
  onValidateGroupInputs,
  onExecutePanel,
  onValidatePanel,
  id,
  title,
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
    validate: useCallback(groupInputs => {
      return onValidateGroupInputs({ groupId: id, inputs: groupInputs })
    }, [ id, onValidateGroupInputs ])
  })

  // execute panel
  const onExecute = useCallback(async (panelId, panelInputs) => {
    if (!allInputsAreValid) {
      console.error('Please fix inputs')
      return null
    }

    const combinedInputs = {
      ...inputValue,
      ...panelInputs,
    }

    return onExecutePanel({ groupId: id, panelId, inputs: combinedInputs })
  }, [ id, inputValue, allInputsAreValid, onExecutePanel ])

  // validate panel
  const onValidate = useCallback(async (panelId, panelInputs) => {
    const combinedInputs = {
      ...inputValue,
      ...panelInputs,
    }

    return onValidatePanel({ groupId: id, panelId, inputs: combinedInputs })
  }, [ id, inputValue, onValidatePanel ])

  return (
    <div>
      <Id>{id}</Id>
      <Title>{title}</Title>

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

export class GroupBuilder {
  constructor ({ id, config: { title } }) {
    this.attrs = { id, title }
    this.inputs = []
    this.panels = []
    this.currentPanel = null
  }

  get id () {
    return this.attrs.id
  }

  getInput = async (id, name, config) => {
    if (this.currentPanel) {
      await this.currentPanel.addInput(id, name, config)
    } else {
      this.inputs.push({ id, name, config })
    }
  }

  startPanel = (id, config) => {
    this.currentPanel = new PanelBuilder({ id, config })
  }

  endPanel = () => {
    this.panels.push(this.currentPanel)
    this.currentPanel = null
  }

  buildContent (callbacks) {
    return (
      <Group
        inputs={this.inputs}
        panels={this.panels}
        {...this.attrs}
        {...callbacks}
      />
    )
  }
}
