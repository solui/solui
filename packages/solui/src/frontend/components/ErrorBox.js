import React from 'react'
import styled from '@emotion/styled'

import Icon from './Icon'
import { flex } from '../styles/fragments'
import { openSans } from '../styles/fonts'

const Container = styled.div`
  font-size: 1rem;
`

const ErrorDiv = styled.div`
  ${flex({ direction: 'row', justify: 'flex-start' })}
  background-color: ${({ theme }) => theme.errorBgColor};
  color: ${({ theme }) => theme.errorTextColor};
  padding: 0.6em;
  border-radius: 5px;
`

const ErrorDetails = styled.div`
  ${openSans()}
  line-height: 1.2em;
`

const Msg = styled.p`
  font-size: 100%;
`

const SubMsg = styled.p`
  font-size: 90%;
  margin: 0.5em 0 0 1em;
`

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
            <Msg>{`${e}`}</Msg>
            {e.details ? e.details.map(d => (
              <SubMsg key={`${d}`}>- {`${d}`}</SubMsg>
            )) : null}
          </ErrorDetails>
        </ErrorDiv>
      ))}
    </Container>
  )
}
