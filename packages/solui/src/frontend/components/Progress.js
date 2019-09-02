import React from 'react'
import styled from '@emotion/styled'

import Icon from './Icon'

const Container = styled.div`
  background-color: ${({ theme }) => theme.progressBgColor};
  color: ${({ theme }) => theme.progressTextColor};
  border-radius: 5px;
  padding: 1em;
  font-size: 1.2rem;
`

const StyledIcon = styled(Icon)`
  margin-right: 0.4em;
  color: ${({ theme }) => theme.progressIconColor};
  font-size: 150%;
`

export default ({ className, children }) => {
  return (
    <Container className={className}>
      <StyledIcon name="laugh-squint" spin />
      {children}
    </Container>
  )
}
