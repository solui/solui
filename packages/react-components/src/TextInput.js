/* eslint-disable-next-line import/no-extraneous-dependencies */
import React, { useCallback, useMemo } from 'react'
import styled from '@emotion/styled'
import { flex } from '@solui/styles'

import ErrorBox from './ErrorBox'

const Container = styled.div`
  ${flex({ justify: 'flex-start', align: 'flex-start' })};
`

const Label = styled.label`
  ${({ theme }) => theme.font('body', 'thin')};
  display: block;
  color: ${({ theme }) => theme.inputLabelTextColor};
  font-size: 1.1rem;
  margin-bottom: 0.3rem;
`

const Input = styled.input`
  ${({ theme }) => theme.font('header')};
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
  width: 100%;
  margin-top: 0.5rem;
  font-size: 1rem;
`

const getPlaceholder = ({ type }) => {
  switch (type) {
    case 'email':
      return 'Email address'
    default:
      return type
  }
}

const getInputType = ({ type }) => {
  switch (type) {
    case 'address':
      return 'text'
    case 'email':
    default:
      return type
  }
}

export default ({ className, name, onChange, value, error, title, type }) => {
  const inputType = useMemo(() => getInputType({ type }), [ type ])
  const placeholder = useMemo(() => getPlaceholder({ type }), [ type ])

  const onTextChange = useCallback(e => onChange(e.currentTarget.value), [ onChange ])

  return (
    <Container className={className}>
      <Label>{title}</Label>
      <Input
        type={inputType}
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
