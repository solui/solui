import React from 'react'
import styled from '@emotion/styled'

import { GroupBuilder } from './Group'

const Id = styled.h1`
  font-size: 2rem;
  margin-bottom: 0.5em;
`

const Description = styled.p`
  font-size: 1.2rem;
  margin: 0 2rem;
`

const GroupContainer = styled.li`
  display: block;
  border: 1px solid ${({ theme }) => theme.panelBorderColor};
  padding: 1rem;
  margin-bottom: 1rem;
`

export const Interface = ({
  onValidateGroupInputs,
  onExecutePanel,
  onValidatePanel,
  id,
  description,
  groups
}) => {
  return (
    <div>
      <Id>{id}</Id>
      <Description>{description}</Description>
      {groups.map(group => (
        <GroupContainer key={group.id}>
          {group.buildContent({
            onValidateGroupInputs,
            onValidatePanel,
            onExecutePanel,
          })}
        </GroupContainer>
      ))}
    </div>
  )
}

export class InterfaceBuilder {
  constructor () {
    this.groups = []
    this.currentGroup = null
  }

  startUi = (id, description) => {
    this.attrs = { id, description }
  }

  endUi = () => {}

  startGroup = async (id, config) => {
    this.currentGroup = new GroupBuilder({ id, config })
  }

  endGroup = async () => {
    this.groups.push(this.currentGroup)
    this.currentGroup = null
  }

  getInput = async (...args) => {
    if (!this.currentGroup) {
      throw new Error('Not in a group')
    }

    return this.currentGroup.getInput(...args)
  }

  startPanel = async (...args) => {
    if (!this.currentGroup) {
      throw new Error('Not in a group')
    }

    await this.currentGroup.startPanel(...args)
  }

  endPanel = async (...args) => {
    if (!this.currentGroup) {
      throw new Error('Not in a group')
    }

    await this.currentGroup.endPanel(...args)
  }

  buildContent (callbacks) {
    return (
      <Interface
        groups={this.groups}
        {...this.attrs}
        {...callbacks}
      />
    )
  }
}
