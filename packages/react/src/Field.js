/* eslint-disable-next-line import/no-extraneous-dependencies */
import React, { useMemo } from 'react'
import styled from '@emotion/styled'
import { flex } from '@solui/styles'

import ErrorBox from './ErrorBox'
import IconButton from './IconButton'
import TextInput from './TextInput'
import { getInputHelpBasedOnInputConfig } from './utils'

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

/**
 * Render an input field.
 * @return {ReactElement}
 */
const Field = ({
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
    const { helpStr, tips } = getInputHelpBasedOnInputConfig({ type, value, validationConfig })

    return {
      helpText: helpStr,
      tooltip: tips.length ? tips.join('\n') : '',
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

export default Field
