import React from 'react'
import styled from '@emotion/styled'

import Error from './Error'

const Container = styled.div`
  padding: 1rem;
  background-color: ${({ theme }) => theme.resultBgColor};
`

const Title = styled.h3`
  margin: 0 0 1em;
  font-size: 1.2rem;
  font-weight: cold;
`

const Value = styled.p``

export default ({ result: { value, error }, config }) => {
  if (error) {
    return <Error error={error} />
  } else {
    if (config) {
      return (
        <Container>
          <Title>{config.title}</Title>
          <Value>{value}</Value>
        </Container>
      )
    } else {
      return <Container>Success!</Container>
    }
  }
}
