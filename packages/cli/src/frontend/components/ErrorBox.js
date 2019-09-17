import React from 'react'
import styled from '@emotion/styled'
import { flex } from '@solui/styles'

import Icon from './Icon'

const Container = styled.div`
  font-size: 1rem;
`

const ErrorDiv = styled.div`
  ${flex({ direction: 'row', justify: 'flex-start' })};
  background-color: ${({ theme }) => theme.errorBgColor};
  color: ${({ theme }) => theme.errorTextColor};
  padding: 0.6em;
  border-radius: 5px;
`

const StyledIcon = styled(Icon)`
  color: ${({ theme }) => theme.errorIconColor};
  margin-right: 0.6em;
  font-size: 150%;
`

const Details = styled.div`
  ${({ theme }) => theme.font('header')};
  width: 90%;
  word-break: break-all;
  line-height: 1.2em;
`

const Msg = styled.p`
  font-size: 100%;
`

const SubMsg = styled.p`
  font-size: 90%;
  margin: 0.5em 0 0 1em;
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
          <Details>
            <Msg>{`${e}`}</Msg>
            {e.details ? e.details.map(d => (
              <SubMsg key={`${d}`}>- {`${d}`}</SubMsg>
            )) : null}
          </Details>
        </ErrorDiv>
      ))}
    </Container>
  )
}
