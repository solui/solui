import React, { useState, useEffect, useCallback } from 'react'
import styled from '@emotion/styled'
import { _, createErrorWithDetails } from '@solui/utils'
import { process as processSpec, validateGroupInputs, validatePanel, executePanel } from '@solui/processor'

import Layout from './components/Layout'
import { InterfaceBuilder } from './components/Interface'
import ErrorBox from './components/ErrorBox'
import Progress from './components/Progress'
import NetworkInfo from './components/NetworkInfo'

const Container = styled.div``

const Interface = styled.div``

const StyledProgress = styled(Progress)`
  margin: 1rem;
`

const StyledError = styled(ErrorBox)`
  margin: 1rem;
`

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

      try {
        const { errors } = await processSpec({ spec, artifacts }, int)

        if (errors.notEmpty) {
          throw createErrorWithDetails('There were processing errors', errors.toStringArray())
        }

        setBuildResult({ interface: int })
      } catch (err) {
        console.error(err)
        setBuildResult({ error: err })
      }
    })()
  }, [ onValidatePanel, onValidateGroupInputs, onExecutePanel, spec, artifacts ])

  return (
    <Layout>
      {(!network) ? <StyledProgress>Waiting for Ethereum network connection</StyledProgress> : (
        <Container>
          <NetworkInfo network={network} />
          {(!buildResult) ? <StyledProgress>Rendering...</StyledProgress> : (
            <Interface>
              {buildResult.error ? <StyledError error={buildResult.error} /> : (
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
