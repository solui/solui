import React, { useCallback, useMemo } from 'react'
import styled from '@emotion/styled'

import ErrorBox from './ErrorBox'
import { flex } from '../styles/fragments'
import { roboto, openSans } from '../styles/fonts'

const Container = styled.div`
  ${flex({ justify: 'flex-start', align: 'flex-start' })}
`

const Label = styled.label`
  ${roboto('thin')}
  display: block;
  color: ${({ theme }) => theme.inputLabelTextColor};
  font-size: 1.1rem;
  margin-bottom: 0.3rem;
`

const Input = styled.input`
  ${openSans()}
  display: block;
  width: 100%;
  border: 1px solid ${({ theme, hasError }) => (hasError ? theme.inputErrorBorderColor : theme.inputBorderColor)};
  background-color: ${({ theme, hasError }) => (hasError ? theme.inputErrorBgColor : theme.inputBgColor)};
  color: ${({ theme }) => theme.inputTextColor};
  padding: 1em;
  font-size: 1rem;
  outline: none;

  &:focus {
    border-color: ${({ theme }) => theme.inputFocusBorderColor};
    background-color: ${({ theme }) => theme.inputFocusBgColor};
  }
 `

const StyledErrorBox = styled(ErrorBox)`
  margin-top: 0.5rem;
  font-size: 1rem;
`

const getPlaceholder = ({ type }) => type

export default ({ className, name, onChange, value, error, config: { title, type } }) => {
  const placeholder = useMemo(() => getPlaceholder({ type }), [ type ])

  const onTextChange = useCallback(e => onChange(e.currentTarget.value), [ onChange ])

  return (
    <Container className={className}>
      <Label>{title}</Label>
      <Input
        type="text"
        name={name}
        onChange={onTextChange}
        value={value}
        placeholder={placeholder}
        hasError={!!error}
      />
      {error ? <StyledErrorBox error={error} /> : null}
    </Container>
  )
}
