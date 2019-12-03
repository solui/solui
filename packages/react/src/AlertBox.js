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
  background-color: ${({ theme }) => theme.alertBgColor};
  color: ${({ theme }) => theme.alertTextColor};
  padding: 0.6em;
  border-radius: 5px;
`

const StyledIcon = styled(Icon)`
  color: ${({ theme }) => theme.alertIconColor};
  margin-right: 0.6em;
  font-size: 150%;
`

const Details = styled.div`
  ${({ theme }) => theme.font('header')};
  width: 90%;
  word-break: break-all;
  line-height: 1.2em;
`

const Msg = styled.p`
  font-size: 100%;
`

/**
 * Render an alert.
 * @return {ReactElement}
 */
const AlertBox = ({ className, msg }) => {
  return (
    <Container className={className}>
      <Div>
        <StyledIcon name='info' />
        <Details>
          <Msg>{msg}</Msg>
        </Details>
      </Div>
    </Container>
  )
}

export default AlertBox
