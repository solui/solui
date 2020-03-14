/* eslint-disable-next-line import/no-extraneous-dependencies */
import React, { forwardRef, useMemo, useState, useCallback, Fragment } from 'react'
import styled from '@emotion/styled'
import { flex } from '@solui/styles'

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

const INPUT_TYPE_COMMA = 'COMMA'
const INPUT_TYPE_LINE = 'LINE'


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
  const [ inputType, setInputType ] = useState(INPUT_TYPE_COMMA)

  const onTextChange = useCallback(({ currentTarget: { value: inputValue } }) => {
    let decodedValue

    switch (inputType) {
      case INPUT_TYPE_COMMA:
        decodedValue = inputValue.split(',').map(v => v.trim())
        break
      case INPUT_TYPE_LINE:
        decodedValue = inputValue.split("\n")
        break
    }

    onChange(decodedValue)
  }, [ onChange, inputType ])

  const displayValue = useMemo(() => {
    const sanitizedValue = value || []

    switch (inputType) {
      case INPUT_TYPE_COMMA:
        return sanitizedValue.join(',')
        break
      case INPUT_TYPE_LINE:
        return sanitizedValue.join("\n")
        break
    }
  }, [ inputType, value ])

  return (
    <Container className={className}>
      <RadioButtons>
        <RadioButton
          name="inputType"
          value={INPUT_TYPE_COMMA}
          selectedValue={inputType}
          onSelect={setInputType}
          label='Comma-separated items'
        />
        <RadioButton
          name="inputType"
          value={INPUT_TYPE_LINE}
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
