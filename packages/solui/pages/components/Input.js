import React, { useState, useCallback } from 'react'
import styled from '@emotion/styled'

import Error from './Error'

const Container = styled.div`
  margin: 1rem 0;
`

export default ({ id, onChange, value, config: { title } }) => {
  const [ error, setError ] = useState()

  const onTextChange = useCallback(e => {
    setError(null)
    const { value: v } = e.currentTarget
    onChange(v, !!v)
  }, [ onChange ])

  return (
    <Container>
      <label>{title}</label>
      <input type="text" name={id} onChange={onTextChange} value={value} />
      {error ? <Error>{error}</Error> : null}
    </Container>
  )
}
