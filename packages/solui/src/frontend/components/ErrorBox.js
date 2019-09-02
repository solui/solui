import React from 'react'
import styled from '@emotion/styled'

import Icon from './Icon'
import { flex } from '../styles/fragments'

const Container = styled.div`
  font-size: 1rem;
`

const ErrorDiv = styled.div`
  ${flex({ direction: 'row', justify: 'flex-start' })}
  background-color: ${({ theme }) => theme.errorBgColor};
  color: ${({ theme }) => theme.errorTextColor};
  padding: 0.5em;
  border-radius: 5px;
`

const ErrorDetails = styled.div``

const StyledIcon = styled(Icon)`
  color: ${({ theme }) => theme.errorIconColor};
  margin-right: 0.4em;
  font-size: 150%;
`

export default ({ className, error }) => {
  if (!Array.isArray(error)) {
    error = [ error ]
  }

  return (
    <Container className={className}>
      {error.map(e => (
        <ErrorDiv key={`${e}`}>
          <StyledIcon name='exclamation' />
          <ErrorDetails>
            <p>{`${e}`}</p>
            {e.details ? e.details.map(d => (
              <p key={`${d}`}>- {`${d}`}</p>
            )) : null}
          </ErrorDetails>
        </ErrorDiv>
      ))}
    </Container>
  )
}
