import React from 'react'
import styled from '@emotion/styled'

const Container = styled.div`
  background-color: ${({ theme }) => theme.errorBgColor};
  padding: 1rem;
`

export default ({ error }) => {
  if (!Array.isArray(error)) {
    error = [ error ]
  }

  return (
    <Container>
      {error.map(e => (
        <div key={e.toString()}>
          <p>{e.toString()}</p>
          {e.details ? e.details.map(d => (
            <p key={d.toString()}>- {d.toString()}</p>
          )) : null}
        </div>
      ))}
    </Container>
  )
}
