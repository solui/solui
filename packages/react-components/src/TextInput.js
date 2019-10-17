/* eslint-disable-next-line import/no-extraneous-dependencies */
import React, { forwardRef, useCallback, useMemo } from 'react'
import styled from '@emotion/styled'


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

  &::placeholder {
    ${({ theme }) => theme.font('header', 'regular', 'italic')};
    color: ${({ theme }) => theme.inputPlaceholderTextColor};
  }
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
  return type
}

export default forwardRef(({
  className,
  name,
  onChange,
  value,
  error,
  type,
  placeholder
}, ref) => {
  const inputType = useMemo(() => getInputType({ type }), [ type ])
  const placeholderStr = useMemo(
    () => placeholder || getPlaceholder({ type }),
    [ type, placeholder ]
  )

  const onTextChange = useCallback(e => onChange(e.currentTarget.value), [ onChange ])

  return (
    <Input
      ref={ref}
      className={className}
      type={inputType}
      name={name}
      onChange={onTextChange}
      value={value}
      placeholder={placeholderStr}
      hasError={!!error}
    />
  )
})
