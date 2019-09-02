import React from 'react'
import styled from '@emotion/styled'

import { GroupBuilder } from './Group'
import Image from './Image'
import { flex } from '../styles/fragments'
import { media } from '../styles/breakpoints'

const Container = styled.div`
  ${flex()}
  position: 'relative';
`

const Info = styled.div`
  ${flex()}
  text-align: center;
  margin: 0 auto;
  padding: 0 2rem;

  ${media.when({ minW: 'mobile' })} {
    max-width: 600px;
  }
`

const Title = styled.h1`
  font-size: 2rem;
  margin: 1.5rem 0;
`

const Description = styled.p`
  font-size: 1.2rem;
  margin: 0;
`

const MainImage = styled(Image)`
  width: 250px;
  height: auto;
  max-height: 250px;
  border: 1px dashed ${({ theme }) => theme.imgBorderColor};
  border-radius: 5px;
`

const Groups = styled.div`
  ${media.when({ minW: 'mobile' })} {
    max-width: 700px;
  }
`

const GroupContainer = styled.li`
  display: block;
  border: 1px solid ${({ theme }) => theme.panelBorderColor};
  border-radius: 5px;
  margin: 3rem 0 1rem;
  padding: 0 2rem;
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
