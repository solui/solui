/* eslint-disable-next-line import/no-extraneous-dependencies */
import React, { useState, useEffect, useCallback } from 'react'
import styled from '@emotion/styled'
import { _, createErrorWithDetails } from '@solui/utils'
import { flex, boxShadow } from '@solui/styles'

import { InterfaceBuilder } from './Interface'
import ErrorBox from './ErrorBox'
import Progress from './Progress'
import NetworkInfoView from './NetworkInfoView'

const Container = styled.div`
  ${flex({ justify: 'center', align: 'center' })}
  padding: 2rem;
`

const InnerContainer = styled.div`
  background-color: ${({ theme }) => theme.interfaceBgColor};
  color: ${({ theme }) => theme.interfaceTextColor};
  border-radius: 5px;
  ${({ theme }) => boxShadow({ color: theme.interfaceShadowColor })};
`

const StyledProgress = styled(Progress)`
  margin: 1rem;
`

const StyledError = styled(ErrorBox)`
  margin: 1rem;
`

const StyledNetworkInfoView = styled(NetworkInfoView)`
  padding: 0.5rem;
  text-align: right;
`

/**
 * Render a UI.
 * @return {ReactElement}
 */
const Dapp = ({
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
      node: _.get(network, 'node'),
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
      node: _.get(network, 'node'),
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
      node: network.node,
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
      <InnerContainer>
        {(!network) ? <StyledProgress>Waiting for Ethereum network connection</StyledProgress> : (
          <div>
            <StyledNetworkInfoView network={network} />
            {/* eslint-disable-next-line no-nested-ternary */}
            {(!buildResult) ? <StyledProgress>Rendering...</StyledProgress> : (
              buildResult.error ? <StyledError error={buildResult.error} /> : (
                buildResult.interface.buildContent({
                  onValidateGroupInputs,
                  onValidatePanel,
                  onExecutePanel,
                })
              )
            )}
          </div>
        )}
      </InnerContainer>
    </Container>
  )
}

export default Dapp
