import React from 'react'
import styled from '@emotion/styled'

import ErrorBox from './ErrorBox'
import Value from './Value'

const Container = styled.div`
  padding: 1rem;
  background-color: ${({ theme }) => theme.resultBgColor};
`

const Title = styled.h3`
  margin: 0 0 1em;
  font-size: 1.2rem;
  font-weight: cold;
`

export default ({ className, result: { value, error }, config: { title, type } }) => {
  if (error) {
    return <ErrorBox className={className} error={error} />
  } else {
    if (title && type) {
      return (
        <Container className={className}>
          <Title>{title}</Title>
          <Value type={type} value={value} />
        </Container>
      )
    } else {
      return <Container className={className}>Success!</Container>
    }
  }
}
