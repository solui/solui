/* eslint-disable-next-line import/no-extraneous-dependencies */
import React, { useState, useEffect, useCallback, useMemo } from 'react'
import styled from '@emotion/styled'
import { _, createErrorWithDetails } from '@solui/utils'
import { flex, boxShadow, childAnchors } from '@solui/styles'

import { InterfaceBuilder } from './Interface'
import ErrorBox from './ErrorBox'
import Identicon from './Identicon'
import Progress from './Progress'
import Button from './Button'
import NetworkInfoLabel from './NetworkInfoLabel'
import Menu from './Menu'

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

const Preamble = styled.div`
  ${flex({ direction: 'column', justify: 'center', align: 'center' })};
  margin-bottom: 1rem;
`

const TopBar = styled.div`
  ${flex({ direction: 'row', justify: 'space-between', align: 'center' })};
  padding: 0.5rem;
  text-align: right;
`

const BottomBar = styled.div`
  border-top: 1px dashed ${({ theme }) => theme.interfaceMenuBorderColor};
  margin-top: 3rem;
  padding: 2rem 0;
`

const StyledMenu = styled(Menu)`
  padding: 0 1.5rem;
  margin-bottom: 3rem;
`

const Credit = styled.p`
  ${({ theme }) => theme.font('body', 'thin')};
  text-align: center;
  color: ${({ theme }) => theme.creditTextColor};
  ${({ theme }) => childAnchors({
    textColor: theme.creditAnchorTextColor,
    hoverTextColor: theme.creditAnchorHoverTextColor,
    hoverBgColor: theme.creditAnchorHoverBgColor,
    borderBottomColor: theme.creditAnchorBorderBottomColor,
  })};
`

const AccountInfo = styled.div`
  ${flex({ direction: 'row', justify: 'flex-start', align: 'center' })};
  font-size: 0.7rem;
`

const AccountIcon = styled(Identicon)`
  width: 24px;
  height: 24px;
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
  const [buildResult, setBuildResult] = useState()

  const [refreshCounter, setRefreshCounter] = useState(0)
  const account = useMemo(() => _.get(network, 'account'), [ network, refreshCounter ])

  // validate a panel's inputs
  const onValidatePanel = useCallback(async ({ panelId, inputs }) => {
    if (!account) {
      throw new Error('Account not available')
    }

    return validatePanel({
      artifacts,
      spec,
      panelId,
      inputs,
      network,
    })
  }, [ spec, artifacts, network, validatePanel, account ])

  // execute a panel
  const onExecutePanel = useCallback(async ({ panelId, inputs, executionProgressCallback }) => {
    if (!account) {
      throw new Error('Account not available')
    }

    return executePanel({
      artifacts,
      spec,
      panelId,
      inputs,
      network,
      progressCallback: executionProgressCallback,
    })
  }, [ spec, artifacts, network, executePanel, account  ])

  // build interface
  useEffect(() => {
    if (!account) {
      return
    }

    (async () => {
      // assert validity
      try {
        await validateSpec({ spec, artifacts, network })
      } catch (err) {
        console.error(err)
        setBuildResult({ error: err })
        return
      }

      try {
        const int = new InterfaceBuilder()
        const { errors } = await processSpec({ spec, artifacts, network }, int)

        if (errors.notEmpty) {
          throw createErrorWithDetails('There were processing errors', errors.toStringArray())
        }

        setBuildResult({ interface: int })
      } catch (err) {
        console.error(err)
        setBuildResult({ error: err })
      }
    })()
  }, [ onValidatePanel, onExecutePanel, spec, artifacts, validateSpec, processSpec, network, account ])

  const enableAccountAccess = useCallback(async () => {
    await network.enableAccountAccess()
    setRefreshCounter(refreshCounter + 1)
  }, [ network, refreshCounter ])

  let content

  if (!network) {
    content = (
      <StyledProgress>Waiting for Ethereum network connection (please check your wallet / Metamask!)</StyledProgress>
    )
  } else if (!account) {
    content = (
      <Preamble>
        <StyledProgress>We need your permission to know your Ethereum account address</StyledProgress>
        <Button onClick={enableAccountAccess}>Enable access</Button>
      </Preamble>
    )
  } else {
    content = (
      <div>
        <TopBar>
          <AccountInfo>
            <AccountIcon hash={account} tooltip={`Your address: ${account}`} />
            {account.substr(0, 9)}...
          </AccountInfo>
          <NetworkInfoLabel network={network} />
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
        <BottomBar>
          <StyledMenu
            embedUrl={embedUrl}
            spec={spec}
            artifacts={artifacts}
          />
          <Credit>Powered by <a href="https://solui.dev">solUI</a></Credit>
        </BottomBar>
      </div>
    )
  }

  return (
    <Container className={className}>
      <InnerContainer>{content}</InnerContainer>
    </Container>
  )
}

export default Dapp
