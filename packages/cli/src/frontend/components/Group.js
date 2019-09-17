import React, { useCallback } from 'react'
import styled from '@emotion/styled'
import { flex, boxShadow, smoothTransitions } from '@solui/styles'

import { PanelBuilder } from './Panel'
import Inputs from './Inputs'
import Image from './Image'
import { useInputHooks } from '../hooks/inputs'

const containerActiveCss = theme => `
  background-color: ${theme.groupActiveBgColor};
  border: 1px solid ${theme.groupActiveBorderColor};
  ${boxShadow({ color: theme.groupActiveShadowColor })};
`

const Container = styled.div`
  ${smoothTransitions()};
  background-color: ${({ theme }) => theme.groupBgColor};
  border: 1px solid ${({ theme }) => theme.groupBorderColor};
  ${({ expanded, theme }) => (expanded ? containerActiveCss(theme) : '')};
  border-radius: 5px;
  cursor: ${({ expanded }) => (expanded ? 'default' : 'pointer')};
  padding: 1rem;

  &:hover {
    ${({ theme }) => containerActiveCss(theme)};
  }
`

const Info = styled.div`
  ${flex({ direction: 'row', justify: 'flex-start' })}
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

const GroupImage = styled(Image)`
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

const PanelContainer = styled.div`
  border: 1px dashed ${({ theme }) => theme.panelBorderColor};
  background-color: ${({ theme }) => theme.panelBgColor};
  border-radius: 5px;
  margin-top: 3rem;

  &:hover {
    border-color:
  }
`

export const Group = ({
  expanded,
  onClick,
  onValidateGroupInputs,
  onExecutePanel,
  onValidatePanel,
  id,
  title,
  description,
  image,
  inputs,
  panels
}) => {
  const onClickContainer = useCallback(() => onClick(id), [ onClick, id ])

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
    <Container onClick={onClickContainer} expanded={expanded}>
      <Info>
        {image ? <GroupImage {...image} /> : null}
        <InfoText>
          <Title>{title}</Title>
          {description ? <Description>{description}</Description> : null}
        </InfoText>
      </Info>
      <Content expanded={expanded}>
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
              canExecute: allInputsAreValid,
              onExecute,
              onValidate,
            })}
          </PanelContainer>
        ))}
      </Content>
    </Container>
  )
}

export class GroupBuilder {
  constructor ({ id, attrs: { title, description, image } }) {
    this.attrs = { id, title, description, image }
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

  buildContent (props) {
    return (
      <Group
        inputs={this.inputs}
        panels={this.panels}
        {...this.attrs}
        {...props}
      />
    )
  }
}
