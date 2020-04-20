/* eslint-disable-next-line import/no-extraneous-dependencies */
import React, { useState, useEffect, useCallback } from 'react'
import styled from '@emotion/styled'
import { flex, media } from '@solui/styles'

import { PanelBuilder } from './Panel'
import Image from './Image'

const Container = styled.div`
  ${flex()}
  margin: 0;
  padding: 2rem;

  ${media.when({ minW: 'mobile' })} {
    max-width: 600px;
  }
`

const Info = styled.div`
  ${flex()}
  text-align: center;
  margin: 0 auto 1rem;
  padding: 0 2rem;
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

const Panels = styled.div`
  width: 100%;
`

const PanelContainer = styled.li`
  display: block;
  margin: 3rem 0 1rem;
`

/**
 * Render an interface.
 *
 * @see {Dapp}
 * @return {ReactElement}
 */
export const Interface = ({
  onExecutePanel,
  onValidatePanel,
  showMainnetWarning,
  title,
  description,
  image,
  panels
}) => {
  const [ selectedPanel, setSelectedPanel ] = useState()

  const onSelectPanel = useCallback(gid => {
    setSelectedPanel(selectedPanel === gid ? null : gid)
  }, [ selectedPanel ])

  useEffect(() => {
    if (window && window.document) {
      window.document.title = title
    }
  }, [ title ])

  return (
    <Container>
      <Info>
        {image ? <MainImage {...image} /> : null}
        <Title>{title}</Title>
        <Description>{description}</Description>
      </Info>
      <Panels>
        {panels.map(panel => (
          <PanelContainer key={panel.id}>
            {panel.buildContent({
              onValidate: onValidatePanel,
              onExecute: onExecutePanel,
              onClick: onSelectPanel,
              expanded: selectedPanel === panel.id,
              showMainnetWarning,
            })}
          </PanelContainer>
        ))}
      </Panels>
    </Container>
  )
}

export class InterfaceBuilder {
  constructor () {
    this.panels = []
    this.currentPanel = null
  }

  startUi = (id, attrs) => {
    this.attrs = attrs
  }

  endUi = () => {}

  startPanel = async (id, attrs) => {
    this.currentPanel = new PanelBuilder({ id, attrs })
  }

  endPanel = async () => {
    this.panels.push(this.currentPanel)
    this.currentPanel = null
  }

  processInput = async (...args) => {
    if (!this.currentPanel) {
      throw new Error('Not in a group')
    }

    return this.currentPanel.processInput(...args)
  }

  buildContent (props) {
    return (
      <Interface
        panels={this.panels}
        {...this.attrs}
        {...props}
      />
    )
  }
}
