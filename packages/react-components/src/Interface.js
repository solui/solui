/* eslint-disable-next-line import/no-extraneous-dependencies */
import React, { useState } from 'react'
import styled from '@emotion/styled'
import { flex, media } from '@solui/styles'

import { GroupBuilder } from './Group'
import Image from './Image'

const Container = styled.div`
  ${flex()}
  margin: 2rem 1rem;
`

const Info = styled.div`
  ${flex()}
  text-align: center;
  margin: 0 auto 1rem;
  padding: 0 2rem;

  ${media.when({ minW: 'mobile' })} {
    max-width: 600px;
  }
`

const MainImage = styled(Image)`
  width: 250px;
  height: auto;
  max-height: 250px;
  border-radius: 5px;
  margin-bottom: 1.5rem;
`

const Title = styled.h1`
  font-size: 2rem;
  margin: 0 0 1.5rem;
`

const Description = styled.p`
  font-size: 1.2rem;
  margin: 0;
  line-height: 1.2em;
`

const Groups = styled.div`
  width: 100%;
  ${media.when({ minW: 'mobile' })} {
    max-width: 700px;
  }
`

const GroupContainer = styled.li`
  display: block;
  margin: 3rem 0 1rem;
`

export const Interface = ({
  onValidateGroupInputs,
  onExecutePanel,
  onValidatePanel,
  title,
  description,
  image,
  groups
}) => {
  const [ selectedGroup, setSelectedGroup ] = useState()

  return (
    <Container>
      <Info>
        {image ? <MainImage {...image} /> : null}
        <Title>{title}</Title>
        <Description>{description}</Description>
      </Info>
      <Groups>
        {groups.map(group => (
          <GroupContainer key={group.id}>
            {group.buildContent({
              onValidateGroupInputs,
              onValidatePanel,
              onExecutePanel,
              onClick: setSelectedGroup,
              expanded: selectedGroup === group.id
            })}
          </GroupContainer>
        ))}
      </Groups>
    </Container>
  )
}

export class InterfaceBuilder {
  constructor () {
    this.groups = []
    this.currentGroup = null
  }

  startUi = (id, attrs) => {
    this.attrs = attrs
  }

  endUi = () => {}

  startGroup = async (id, attrs) => {
    this.currentGroup = new GroupBuilder({ id, attrs })
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

  buildContent (props) {
    return (
      <Interface
        groups={this.groups}
        {...this.attrs}
        {...props}
      />
    )
  }
}
