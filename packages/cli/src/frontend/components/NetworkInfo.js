import React from 'react'
import styled from '@emotion/styled'

import { roboto } from '../styles/fonts'

const Container = styled.div`
  background-color: ${({ theme }) => theme.networkInfoBgColor};
  color: ${({ theme }) => theme.networkInfoTextColor};
  padding: 1em;
  ${roboto('thin')}
  text-transform: uppercase;

  span {
    ${roboto('bold')}
    text-transform: initial;
  }
`

export default ({ network: { id, name } }) => (
  <Container>
    Network: <span>{id} - {name}</span>
  </Container>
)
