/* eslint-disable-next-line import/no-extraneous-dependencies */
import React from 'react'
import styled from '@emotion/styled'
import { flex } from '@solui/styles'

import ErrorBox from './ErrorBox'

const Container = styled.div`
  ${flex({ justify: 'flex-start', align: 'flex-start' })};
`

const Label = styled.label`
  ${({ theme }) => theme.font('body', 'thin')};
  display: block;
  color: ${({ theme }) => theme.inputLabelTextColor};
  font-size: 1.1rem;
  margin-bottom: 0.3rem;
`

const StyledErrorBox = styled(ErrorBox)`
  width: 100%;
  margin-top: 0.5rem;
  font-size: 1rem;
`

export default ({ className, error, title, children }) => {
  return (
    <Container className={className}>
      <Label>{title}</Label>
      {children}
      {error ? <StyledErrorBox error={error} /> : null}
    </Container>
  )
}
