import React from 'react'
import styled from '@emotion/styled'

const Container = styled.div`
  background-color: ${({ theme }) => theme.bodyBgColor};
  color: ${({ theme }) => theme.bodyTextColor};
  min-height: 100vh;
`

export default ({ children }) => (
  <Container>{children}</Container>
)
