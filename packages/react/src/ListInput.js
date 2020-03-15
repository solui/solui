/* eslint-disable-next-line import/no-extraneous-dependencies */
import React, { forwardRef, useMemo, useState, useCallback, Fragment } from 'react'
import styled from '@emotion/styled'
import { flex } from '@solui/styles'
import { _ } from '@solui/utils'

import {
  ARRAY_INPUT_TYPE_COMMA,
  ARRAY_INPUT_TYPE_LINE,
  decodeArrayInputFromUser,
  encodeArrayInputForUser
} from './utils/arrayInputs'

const Container = styled.div`
  ${flex({ justify: 'flex-start', align: 'stretch' })};
`

const Input = styled.textarea`
  flex: 1;
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

const RadioButtons = styled.div`
  ${flex({ direction: 'row', justify: 'flex-start', align: 'center', basis: 0 })};
  ${({ theme }) => theme.font('body')};
  margin: 1rem 0 0.5rem;
  width: 100%;
`

const RadioButtonContainer = styled.div`
  ${flex({ direction: 'row', justify: 'flex-start', align: 'center' })};
  margin-right: 1rem;
  cursor: pointer;

  label {
    margin-left: 0.5rem;
    cursor: pointer;
  }
`



const RadioButton = ({ label, onSelect, value, selectedValue, ...props }) => (
  <RadioButtonContainer onClick={() => onSelect(value)}>
    <input
      type='radio'
      value={value}
      checked={selectedValue === value}
      {...props}
    />
    <label>{label}</label>
  </RadioButtonContainer>
)


/**
 * Render a textarea input field for list items.
 * @return {ReactElement}
 */
const ListInput = forwardRef(({
  className,
  name,
  onChange,
  value,
  error,
  placeholder = '',
}, ref) => {
  const [ inputType, setInputType ] = useState(ARRAY_INPUT_TYPE_COMMA)

  const onTextChange = useCallback(({ currentTarget: { value: inputValue } }) => {
    onChange(decodeArrayInputFromUser(inputValue, inputType))
  }, [ onChange, inputType ])

  const displayValue = useMemo(() => {
    return encodeArrayInputForUser(value, inputType)
  }, [ inputType, value ])

  return (
    <Container className={className}>
      <RadioButtons>
        <RadioButton
          name="inputType"
          value={ARRAY_INPUT_TYPE_COMMA}
          selectedValue={inputType}
          onSelect={setInputType}
          label='Comma-separated items'
        />
        <RadioButton
          name="inputType"
          value={ARRAY_INPUT_TYPE_LINE}
          selectedValue={inputType}
          onSelect={setInputType}
          label='One item per line'
        />
      </RadioButtons>
      <Input
        ref={ref}
        name={name}
        onChange={onTextChange}
        value={displayValue}
        placeholder={placeholder}
        hasError={!!error}
      />
    </Container>
  )
})

export default ListInput
