import React, { useCallback } from 'react'
import styled from '@emotion/styled'

const Container = styled.div`
  margin: 1rem 0;
`

export default ({ id, onChange, value, config: { title } }) => {
  const onTextChange = useCallback(e => {
    onChange(e.currentTarget.value)
  }, [ onChange ])

  return (
    <Container>
      <label>{title}</label>
      <input type="text" name={id} onChange={onTextChange} value={value} />
    </Container>
  )
}
