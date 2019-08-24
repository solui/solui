import React, { useMemo } from 'react'
import styled from '@emotion/styled'

import Layout from './components/Layout'
import { PanelBuilder } from './components/Panel'
import Error from './components/Error'
import NetworkInfo from './components/NetworkInfo'
import { process as processSpec } from '../src/spec'
import { flex } from './styles/fragments'
import { GlobalContext } from './_global'

const Container = styled.div``

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
  const { panels, errors } = useMemo(() => {
    const stack = []
    let currentPanel = null

    const callbacks = {
      getInput: (id, cfg) => currentPanel.addInput(id, cfg),
      startUi: (id, cfg) => {
        currentPanel = new PanelBuilder(id, cfg)
      },
      endUi: () => {
        stack.push(currentPanel)
      }
    }

    const processingErrors = processSpec({ ui, artifacts }, callbacks)

    return {
      panels: stack,
      errors: processingErrors
    }
  }, [ ui, artifacts ])

  return (
    <Layout>
      <GlobalContext.Consumer>
        {({ network }) => (
          (!network) ? <div>Waiting for Ethereum network connection</div> : (
            <Container>
              <NetworkInfo network={network} />
              <Panels>
                {errors.length ? <Error error={errors} /> : (
                  panels.map(panel => (
                    <PanelContainer key={panel.id}>
                      {panel.buildContent()}
                    </PanelContainer>
                  ))
                )}
              </Panels>
            </Container>
          )
        )}
      </GlobalContext.Consumer>
    </Layout>
  )
}
