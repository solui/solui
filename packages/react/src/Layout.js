/* eslint-disable-next-line import/no-extraneous-dependencies */
import React from 'react'
import styled from '@emotion/styled'

const Container = styled.div`
  width: 100%;
  min-height: 100vh;
  background: ${({ theme }) => theme.layoutBgColor};
  background-size: 100vw 100vh;
  background-repeat: no-repeat;
  background-attachment: fixed;
  color: ${({ theme }) => theme.bodyTextColor};
  padding-bottom: 20px;
`

/**
 * Render the common layout.
 * @return {ReactElement}
 */
const Layout = ({ children }) => (
  <Container>
    {children}
  </Container>
)

export default Layout
