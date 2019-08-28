import React, { useState, useEffect, useCallback } from 'react'
import styled from '@emotion/styled'

import { _ } from '../src/utils'
import Layout from './components/Layout'
import { InterfaceBuilder } from './components/Interface'
import Error from './components/Error'
import NetworkInfo from './components/NetworkInfo'
import { process as processSpec, validateTopLevelInputs, validatePanel, executePanel } from '../src/spec'
import { flex } from './styles/fragments'

const Container = styled.div``

const Panels = styled.ul`
  list-style: none;
  ${flex({ justify: 'flex-start', align: 'flex-start' })}
`

export default ({ network, appState: { spec, artifacts } }) => {
  const [ buildResult, setBuildResult ] = useState()

  // validate top-level inputs
  const onValidateTopLevelInputs = useCallback(async ({ inputs }) => {
    return validateTopLevelInputs({
      artifacts,
      spec,
      inputs,
      web3: _.get(network, 'web3'),
    })
  }, [ spec, artifacts, network ])

  // validate a panel's inputs
  const onValidatePanel = useCallback(async ({ panelId, inputs }) => {
    return validatePanel({
      artifacts,
      spec,
      panelId,
      inputs,
      web3: _.get(network, 'web3'),
    })
  }, [ spec, artifacts, network ])

  // execute a panel
  const onExecutePanel = useCallback(async ({ panelId, inputs }) => {
    if (!network) {
      throw new Error('Network not available')
    }

    return executePanel({
      artifacts,
      spec,
      panelId,
      inputs,
      web3: network.web3,
    })
  }, [ spec, artifacts, network ])

  // build interface
  useEffect(() => {
    (async () => {
      const int = new InterfaceBuilder({
        onValidateTopLevelInputs,
        onValidatePanel,
        onExecutePanel,
      })

      const processingErrors = await processSpec({ spec, artifacts }, int)

      setBuildResult({
        interface: int,
        errors: processingErrors
      })
    })()
  }, [ onValidatePanel, onValidateTopLevelInputs, onExecutePanel, spec, artifacts ])

  return (
    <Layout>
      {(!network) ? <div>Waiting for Ethereum network connection</div> : (
        <Container>
          <NetworkInfo network={network} />
          {(!buildResult) ? <div>Loading...</div> : (
            <Panels>
              {buildResult.errors.length ? <Error error={buildResult.errors} /> : (
                buildResult.interface.buildContent()
              )}
            </Panels>
          )}
        </Container>
      )}
    </Layout>
  )
}
