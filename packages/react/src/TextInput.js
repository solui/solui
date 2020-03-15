/* eslint-disable-next-line import/no-extraneous-dependencies */
import React, { forwardRef, useCallback, useMemo } from 'react'
import styled from '@emotion/styled'

import { isArrayFieldType } from './utils/values'

import {
  ARRAY_INPUT_TYPE_COMMA,
  decodeArrayInputFromUser,
  encodeArrayInputForUser
} from './utils/arrayInputs'


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
  type,
  error,
  placeholder = '',
}, ref) => {
  const onTextChange = useCallback(({ currentTarget: { value: inputValue } }) => {
    if (isArrayFieldType(type)) {
      onChange(decodeArrayInputFromUser(inputValue, ARRAY_INPUT_TYPE_COMMA))
    } else {
      onChange(inputValue)
    }
  }, [type])

  const displayValue = useMemo(() => {
    if (isArrayFieldType(type)) {
      return encodeArrayInputForUser(value, ARRAY_INPUT_TYPE_COMMA)
    } else {
      return value
    }
  }, [type, value])

  return (
    <Input
      ref={ref}
      className={className}
      type='text'
      name={name}
      onChange={onTextChange}
      value={displayValue}
      placeholder={placeholder}
      hasError={!!error}
    />
  )
})

export default TextInput
