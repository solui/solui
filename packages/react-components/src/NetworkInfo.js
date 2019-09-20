/* eslint-disable-next-line import/no-extraneous-dependencies */
import React from 'react'
import styled from '@emotion/styled'

const Container = styled.div`
  background-color: ${({ theme }) => theme.networkInfoBgColor};
  color: ${({ theme }) => theme.networkInfoTextColor};
  padding: 1em;
  ${({ theme }) => theme.font('body', 'thin')};
  text-transform: uppercase;

  span {
    ${({ theme }) => theme.font('body', 'bold')};
    text-transform: initial;
  }
`

export default ({ network: { id, name } }) => (
  <Container>
    Network: <span>{id} - {name}</span>
  </Container>
)
