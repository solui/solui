/* eslint-disable-next-line import/no-extraneous-dependencies */
import React, { useMemo } from 'react'
import styled from '@emotion/styled'
import { flex } from '@solui/styles'
import { _, toEthVal } from '@solui/utils'

import ErrorBox from './ErrorBox'
import IconButton from './IconButton'
import TextInput from './TextInput'

const Container = styled.div`
  ${flex({ justify: 'flex-start', align: 'flex-start' })};
`

const Label = styled.label`
  ${({ theme }) => theme.font('body', 'regular')};
  display: block;
  color: ${({ theme }) => theme.inputLabelTextColor};
  font-size: 1.1rem;
  margin-bottom: 0.3rem;
`

const StyledErrorBox = styled(ErrorBox)`
  width: 100%;
  margin-top: 0.5rem;
  font-size: 1rem;
`

const FieldTooltip = styled(IconButton)`
  margin-left: 0.5rem;
`

const HelpText = styled.p`
  ${({ theme }) => theme.font('header', 'thin', 'italic')};
  font-size: 80%;
  display: block;
  color: ${({ theme }) => theme.inputHelpTextColor};
  margin-top: 0.2rem;
`

export default ({
  className,
  name,
  title,
  value,
  onChange,
  type,
  validationConfig,
  validationStatus,
}) => {
  const { helpText, tooltip } = useMemo(() => {
    const tips = []
    let helpStr

    switch (type) {
      case 'address': {
        const allowedTypes = _.get(validationConfig, 'allowedTypes', [])

        if (Array.isArray(allowedTypes) && allowedTypes.length) {
          tips.push(`Allowed types: ${allowedTypes.join(', ')}`)
        }

        helpStr = `Length: ${value ? value.length : 0}`

        break
      }
      case 'string': {
        const minLen = parseInt(_.get(validationConfig, 'length.min'), 10)
        const maxLen = parseInt(_.get(validationConfig, 'length.max'), 10)

        if (!Number.isNaN(minLen) && !Number.isNaN(maxLen)) {
          tips.push(`Length: must be between ${minLen} and ${maxLen} characters.`)
        }

        helpStr = `Length: ${value ? value.length : 0}`

        break
      }
      case 'int':
      case 'uint': {
        const minVal = _.get(validationConfig, 'range.min')
        const maxVal = _.get(validationConfig, 'range.max')
        if (minVal && maxVal) {
          tips.push(`Value: must be between ${minVal} and ${maxVal}.`)
        }
        const unit = _.get(validationConfig, 'unit')
        if (unit) {
          tips.push(`Unit: ${unit.toUpperCase()}`)

          const realVal = toEthVal(value, unit)

          helpStr = `Real value: ${realVal ? realVal.toWei().toString(10) : '(not set)'}`
        }

        break
      }
      default:
        // do nothing
    }

    return {
      helpText: helpStr,
      tooltip: tips.length ? tips.join('\n') : null
    }
  }, [ type, value, validationConfig ])

  return (
    <Container className={className}>
      <Label>
        {title}
        {tooltip ? <FieldTooltip tooltip={tooltip} icon={{ name: 'info' }} /> : null}
      </Label>
      <TextInput
        name={name}
        onChange={onChange}
        value={value}
        type='text'
        {...validationStatus}
      />
      {helpText ? <HelpText>{helpText}</HelpText> : null}
      {validationStatus.error ? <StyledErrorBox error={validationStatus.error} /> : null}
    </Container>
  )
}
