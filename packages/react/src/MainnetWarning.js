/* eslint-disable-next-line import/no-extraneous-dependencies */
import React from 'react'
import styled from '@emotion/styled'
import { flex } from '@solui/styles'

import Icon from './Icon'

const Container = styled.div`
  font-size: 1rem;
`

const Div = styled.div`
  ${flex({ direction: 'row', justify: 'flex-start' })};
  background-color: ${({ theme }) => theme.mainnetWarningBgColor};
  color: ${({ theme }) => theme.mainnetWarningTextColor};
  padding: 1em;
  border: 2px dashed ${({ theme }) => theme.mainnetWarningBorderColor};
  border-radius: 5px;
  font-size: 1.2rem;
  line-height: 1.2em;
`

const StyledIcon = styled(Icon)`
  color: ${({ theme }) => theme.mainnetWarningIconColor};
  margin-right: 0.6em;
  font-size: 150%;
`

/**
 * Render the be-careful-on-mainnet warning.
 * @return {ReactElement}
 */
const MainnetWarning = ({ className }) => {
  return (
    <Container className={className}>
      <Div>
        <StyledIcon name='exclamation' />
          This Dapp has NOT been certified by the author for production use on the Ethereum Mainnet.
          Please be careful.
      </Div>
    </Container>
  )
}

export default MainnetWarning
