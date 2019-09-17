import React from 'react'
import styled from '@emotion/styled'
import { robotoFont } from '@solui/styles'


const Container = styled.div`
  background-color: ${({ theme }) => theme.networkInfoBgColor};
  color: ${({ theme }) => theme.networkInfoTextColor};
  padding: 1em;
  ${robotoFont('thin')}
  text-transform: uppercase;

  span {
    ${robotoFont('bold')}
    text-transform: initial;
  }
`

export default ({ network: { id, name } }) => (
  <Container>
    Network: <span>{id} - {name}</span>
  </Container>
)
