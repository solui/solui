import React, { useState, useEffect, useCallback } from 'react'
import styled from '@emotion/styled'

import { _ } from '../src/utils'
import Layout from './components/Layout'
import { InterfaceBuilder } from './components/Interface'
import Error from './components/Error'
import NetworkInfo from './components/NetworkInfo'
import { process as processSpec, validateGroupInputs, validatePanel, executePanel } from '../src/spec'

const Container = styled.div``

const Interface = styled.div``

export default ({ network, appState: { spec, artifacts } }) => {
  const [ buildResult, setBuildResult ] = useState()

  // validate group inputs
  const onValidateGroupInputs = useCallback(async ({ groupId, inputs }) => {
    return validateGroupInputs({
      artifacts,
      spec,
      groupId,
      inputs,
      web3: _.get(network, 'web3'),
    })
  }, [ spec, artifacts, network ])

  // validate a panel's inputs
  const onValidatePanel = useCallback(async ({ groupId, panelId, inputs }) => {
    return validatePanel({
      artifacts,
      spec,
      groupId,
      panelId,
      inputs,
      web3: _.get(network, 'web3'),
    })
  }, [ spec, artifacts, network ])

  // execute a panel
  const onExecutePanel = useCallback(async ({ groupId, panelId, inputs }) => {
    if (!network) {
      throw new Error('Network not available')
    }

    return executePanel({
      artifacts,
      spec,
      groupId,
      panelId,
      inputs,
      web3: network.web3,
    })
  }, [ spec, artifacts, network ])

  // build interface
  useEffect(() => {
    (async () => {
      const int = new InterfaceBuilder()

      const processingErrors = await processSpec({ spec, artifacts }, int)

      setBuildResult({
        interface: int,
        errors: processingErrors
      })
    })()
  }, [ onValidatePanel, onValidateGroupInputs, onExecutePanel, spec, artifacts ])

  return (
    <Layout>
      {(!network) ? <div>Waiting for Ethereum network connection</div> : (
        <Container>
          <NetworkInfo network={network} />
          {(!buildResult) ? <div>Loading...</div> : (
            <Interface>
              {buildResult.errors.length ? <Error error={buildResult.errors} /> : (
                buildResult.interface.buildContent({
                  onValidateGroupInputs,
                  onValidatePanel,
                  onExecutePanel,
                })
              )}
            </Interface>
          )}
        </Container>
      )}
    </Layout>
  )
}
