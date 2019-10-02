import React from 'react'
import styled from '@emotion/styled'
import { flex } from '@solui/styles'
import { process as processSpec, validateGroupInputs, validatePanel, executePanel } from '@solui/processor'
import {
  Dapp,
  NetworkContext,
} from '@solui/react-components'

import { PkgLink } from './Link'

const Container = styled.div`
  ${flex({ justify: 'flex-start', align: 'stretch' })};
`

const Top = styled.div`
  ${flex({ direction: 'row', justify: 'flex-start', align: 'center' })};
  text-transform: lowercase;
  background-color: ${({ theme }) => theme.dappPkgInfoBgColor};
  padding: 1em;
  margin-bottom: 1em;
`

const TopSection = styled.span`
  margin-right: 1rem;
`

const Render = styled.div`
  padding: 1rem;
`

export default ({ pkg, version }) => {
  return (
    <Container>
      <Top>
        <TopSection>Package: <PkgLink pkg={pkg.name}><a>{pkg.name}</a></PkgLink></TopSection>
        <TopSection>Version: {version.id}</TopSection>
      </Top>
      <Render>
        <NetworkContext.Consumer>
          {({ network }) => (
            <Dapp
              network={network}
              spec={version.data.spec}
              artifacts={version.data.artifacts}
              processSpec={processSpec}
              validateGroupInputs={validateGroupInputs}
              validatePanel={validatePanel}
              executePanel={executePanel}
            />
          )}
        </NetworkContext.Consumer>
      </Render>
    </Container>
  )
}
