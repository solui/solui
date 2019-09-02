import React, { useCallback, useMemo } from 'react'
import styled from '@emotion/styled'

import ErrorBox from './ErrorBox'

const Container = styled.div`
  margin: 1rem 0;
`

const getPlaceholder = ({ type }) => type

export default ({ name, onChange, value, error, config: { title, type } }) => {
  const placeholder = useMemo(() => getPlaceholder({ type }), [ type ])

  const onTextChange = useCallback(e => onChange(e.currentTarget.value), [ onChange ])

  return (
    <Container>
      <label>{title}</label>
      <input
        type="text"
        name={name}
        onChange={onTextChange}
        value={value}
        placeholder={placeholder}
        size={64}
      />
      {error ? <ErrorBox error={error} /> : null}
    </Container>
  )
}
