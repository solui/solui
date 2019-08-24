import React, { useEffect, useCallback, useMemo } from 'react'
import styled from '@emotion/styled'
import { isAddress } from 'web3-utils'

import Error from './Error'

const Container = styled.div`
  margin: 1rem 0;
`

const getPlaceholder = ({ type }) => type

export default ({ id, onChange, setValidationResult, value, error, config: { title, type } }) => {
  const placeholder = useMemo(() => getPlaceholder({ type }), [ type ])

  const onTextChange = useCallback(e => onChange(e.currentTarget), [ onChange ])

  // validation takes place after initial render and on subsequent renders
  useEffect(() => {
    let isValid
    switch (type) {
      case 'address': {
        isValid = isAddress(value)
        break
      }
      default:
        isValid = false
    }

    setValidationResult(isValid, '')
  }, [ type, value, setValidationResult ])

  return (
    <Container>
      <label>{title}</label>
      <input
        type="text"
        name={id}
        onChange={onTextChange}
        value={value}
        placeholder={placeholder}
        size={64}
      />
      {error ? <Error error={error} /> : null}
    </Container>
  )
}
