/* eslint-disable-next-line import/no-extraneous-dependencies */
import React, { useState, useEffect, useCallback } from 'react'
import styled from '@emotion/styled'
import { _, createErrorWithDetails } from '@solui/utils'

import { InterfaceBuilder, ErrorBox, Progress, NetworkInfo } from './'

const Container = styled.div``

const StyledProgress = styled(Progress)`
  margin: 1rem;
`

const StyledError = styled(ErrorBox)`
  margin: 1rem;
`

export default ({
  network,
  spec,
  artifacts,
  className,
  processSpec,
  validateGroupInputs,
  validatePanel,
  executePanel,
}) => {
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
  }, [ spec, artifacts, network, validateGroupInputs ])

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
  }, [ spec, artifacts, network, validatePanel ])

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
  }, [ spec, artifacts, network, executePanel ])

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
  }, [ onValidatePanel, onValidateGroupInputs, onExecutePanel, spec, artifacts, processSpec ])

  return (
    <Container className={className}>
      {(!network) ? <StyledProgress>Waiting for Ethereum network connection</StyledProgress> : (
        <div>
          <NetworkInfo network={network} />
          {(!buildResult) ? <StyledProgress>Rendering...</StyledProgress> : (
            <div>
              {buildResult.error ? <StyledError error={buildResult.error} /> : (
                buildResult.interface.buildContent({
                  onValidateGroupInputs,
                  onValidatePanel,
                  onExecutePanel,
                })
              )}
            </div>
          )}
        </div>
      )}
    </Container>
  )
}
