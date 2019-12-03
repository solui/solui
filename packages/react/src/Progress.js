/* eslint-disable-next-line import/no-extraneous-dependencies */
import React from 'react'
import styled from '@emotion/styled'

import LoadingIcon from './LoadingIcon'

const Container = styled.div`
  background-color: ${({ theme }) => theme.progressBgColor};
  color: ${({ theme }) => theme.progressTextColor};
  border-radius: 5px;
  padding: 1em;
  font-size: 1.2rem;
`

const StyledIcon = styled(LoadingIcon)`
  margin-right: 0.4em;
  color: ${({ theme }) => theme.progressIconColor};
  font-size: 150%;
`

/**
 * Render progress indicator with given content.
 * @return {ReactElement}
 */
const Progress = ({ className, children }) => {
  return (
    <Container className={className}>
      <StyledIcon />
      {children}
    </Container>
  )
}

export default Progress
