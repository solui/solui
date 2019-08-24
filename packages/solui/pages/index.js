import React from 'react'
import styled from '@emotion/styled'

import Layout from './components/Layout'
import { PanelBuilder } from './components/Panel'
import Error from './components/Error'
import { parse } from '../src/spec'
import { flex } from './styles/fragments'

const Panels = styled.ul`
  list-style: none;
  ${flex({ justify: 'flex-start', align: 'flex-start' })}
`

const PanelContainer = styled.li`
  display: block;
  border: 1px solid ${({ theme }) => theme.panelBorderColor};
  padding: 1rem;
  margin-bottom: 1rem;
`

export default ({ appState: { ui, artifacts } }) => {
  const panels = []
  let currentPanel = null

  const processor = {
    doInput: (id, cfg) => currentPanel.addInput(id, cfg),
    doExecStep: cfg => currentPanel.addExecutionStep(cfg),
    startPanel: (id, cfg) => {
      currentPanel = new PanelBuilder(id, cfg)
    },
    endPanel: () => {
      panels.push(currentPanel)
    }
  }

  const errors = parse({ ui, artifacts }, processor)

  return (
    <Layout>
      <Panels>
        {errors.length ? <Error error={errors} /> : (
          panels.map(panel => (
            <PanelContainer key={panel.id}>
              {panel.getRenderedContent()}
            </PanelContainer>
          ))
        )}
      </Panels>
    </Layout>
  )
}
