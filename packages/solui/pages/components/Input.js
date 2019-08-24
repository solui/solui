import React, { useCallback, useMemo } from 'react'
import styled from '@emotion/styled'

import Error from './Error'

const Container = styled.div`
  margin: 1rem 0;
`

const getPlaceholder = ({ type }) => type

export default ({ network, id, onChange, value, error, config: { title, type } }) => {
  const onTextChange = useCallback(e => {
    const { value: v } = e.currentTarget

    const { web3 } = network

    let isValid

    switch (type) {
      case 'address': {
        isValid = web3.utils.isAddress(v)
        break
      }
      default:
        isValid = false
    }

    onChange(v, isValid, '')
  }, [ network, type, onChange ])

  const placeholder = useMemo(() => getPlaceholder({ type }), [ type ])

  return (
    <Container>
      <label>{title}</label>
      <input
        type="text"
        name={id}
        onChange={onTextChange}
        value={value}
        placeholder={placeholder}
      />
      {error ? <Error error={error} /> : null}
    </Container>
  )
}
