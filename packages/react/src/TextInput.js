/* eslint-disable-next-line import/no-extraneous-dependencies */
import React, { forwardRef, useCallback, useMemo } from 'react'
import styled from '@emotion/styled'


const Input = styled.input`
  ${({ theme }) => theme.font('body')};
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

  &::placeholder {
    ${({ theme }) => theme.font('header', 'regular', 'italic')};
    color: ${({ theme }) => theme.inputPlaceholderTextColor};
    font-size: 80%;
  }
 `

/**
 * Render a text input field.
 * @return {ReactElement}
 */
const TextInput = forwardRef(({
  className,
  name,
  onChange,
  value,
  error,
  placeholder = '',
}, ref) => {
  const onTextChange = useCallback(e => onChange(e.currentTarget.value), [ onChange ])

  return (
    <Input
      ref={ref}
      className={className}
      type='text'
      name={name}
      onChange={onTextChange}
      value={value}
      placeholder={placeholder}
      hasError={!!error}
    />
  )
})

export default TextInput
