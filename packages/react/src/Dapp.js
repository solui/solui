/* eslint-disable-next-line import/no-extraneous-dependencies */
import React, { useState, useEffect, useCallback } from 'react'
import styled from '@emotion/styled'
import { _, createErrorWithDetails } from '@solui/utils'
import { flex, boxShadow } from '@solui/styles'

import { InterfaceBuilder } from './Interface'
import ErrorBox from './ErrorBox'
import Progress from './Progress'
import NetworkInfoLabel from './NetworkInfoLabel'
import EmbedLabel from './EmbedLabel'

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

const TopBar = styled.div`
  ${flex({ direction: 'row', justify: 'flex-end', align: 'center' })};
  padding: 0.5rem;
  text-align: right;
`

const StyledEmbedLabel = styled(EmbedLabel)`
  margin-left: 2rem;
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
  validateSpec,
  processSpec,
  validatePanel,
  executePanel,
  embedUrl,
}) => {
  const [ buildResult, setBuildResult ] = useState()

  // validate a panel's inputs
  const onValidatePanel = useCallback(async ({ panelId, inputs }) => {
    return validatePanel({
      artifacts,
      spec,
      panelId,
      inputs,
      node: _.get(network, 'node'),
    })
  }, [ spec, artifacts, network, validatePanel ])

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
      node: network.node,
    })
  }, [ spec, artifacts, network, executePanel ])

  // build interface
  useEffect(() => {
    (async () => {
      // assert validity
      try {
        await validateSpec({ spec, artifacts })
      } catch (err) {
        console.error(err)
        setBuildResult({ error: err })
        return
      }

      try {
        const int = new InterfaceBuilder()
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
  }, [ onValidatePanel, onExecutePanel, spec, artifacts, validateSpec, processSpec ])

  return (
    <Container className={className}>
      <InnerContainer>
        {(!network) ? <StyledProgress>Waiting for Ethereum network connection</StyledProgress> : (
          <div>
            <TopBar>
              <NetworkInfoLabel network={network} />
              {embedUrl ? (
                <StyledEmbedLabel embedUrl={embedUrl} />
              ) : null}
            </TopBar>
            {/* eslint-disable-next-line no-nested-ternary */}
            {(!buildResult) ? <StyledProgress>Rendering...</StyledProgress> : (
              buildResult.error ? <StyledError error={buildResult.error} /> : (
                buildResult.interface.buildContent({
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
