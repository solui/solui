/* eslint-disable-next-line import/no-extraneous-dependencies */
import React, { useMemo } from 'react'
import styled from '@emotion/styled'
import { flex } from '@solui/styles'

import ErrorBox from './ErrorBox'
import IconButton from './IconButton'
import TextInput from './TextInput'
import { getMetaTextForInput } from './utils'

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
  line-height: 1.5em;
`

const MetaText = styled.p`
  ${({ theme }) => theme.font('body')};
  display: block;
  color: ${({ theme }) => theme.inputMetaTextColor};
  background-color: ${({ theme }) => theme.inputMetaTextBgColor};
  border-radius: 5px;
  padding: 0.5em;
  margin-top: 0.2rem;
`

const TooltipContent = styled.div`
  text-align: left;
  code {
    font-family: monospace;
  }
  em {
    font-style: italic;
  }
  p {
    margin-top: 2em;
  }
  ul {
    list-style: none;
    display: block;
    li {
      display: block;
      margin: 0.5em 0;
    }
  }
`

/**
 * Render an input field.
 * @return {ReactElement}
 */
const Field = ({
  className,
  name,
  value,
  onChange,
  config: { title, type, helpText, placeholder, ...config },
  validationStatus,
}) => {
  const { metaText, tooltip } = useMemo(() => {
    const { metaText: mt, tooltip: tt } = getMetaTextForInput({ type, value, config })

    return {
      metaText: mt,
      tooltip: tt,
    }
  }, [ type, value, config ])

  return (
    <Container className={className}>
      <Label>
        {title}
        {tooltip ? (
          <FieldTooltip
            tooltip={<TooltipContent>{tooltip}</TooltipContent>}
            icon={{ name: 'info' }}
          />
        ) : null}
      </Label>
      <TextInput
        name={name}
        onChange={onChange}
        value={value}
        placeholder={placeholder}
        type={type}
        {...validationStatus}
      />
      {metaText ? <MetaText>{metaText}</MetaText> : null}
      {helpText ? <HelpText>{helpText}</HelpText> : null}
      {validationStatus.error ? <StyledErrorBox error={validationStatus.error} /> : null}
    </Container>
  )
}

export default Field
