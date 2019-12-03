/* eslint-disable-next-line import/no-extraneous-dependencies */
import React from 'react'
import styled from '@emotion/styled'

const Container = styled.div`
  width: 100%;
  min-height: 100vh;
  background: rgba(62,0,135,1);
  background: linear-gradient(135deg, rgba(62,0,135,1) 0%, rgba(100,36,167,1) 44%, rgba(146,80,205,1) 74%, rgba(202,134,252,1) 100%);
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
