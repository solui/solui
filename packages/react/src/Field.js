/* eslint-disable-next-line import/no-extraneous-dependencies */
import React, { Fragment, useMemo, useState, useCallback } from 'react'
import styled from '@emotion/styled'
import { flex } from '@solui/styles'

import ErrorBox from './ErrorBox'
import { Modal } from './Modal'
import IconButton from './IconButton'
import TextInput from './TextInput'
import ListInput from './ListInput'
import { isArrayFieldType, getMetaTextForInput } from './utils'

const Container = styled.div`
  ${flex({ justify: 'flex-start', align: 'flex-start' })};
`

const InputContainer = styled.div`
  ${flex({ direction: 'row', justify: 'space-around', align: 'center' })};
  width: 100%;
`

const StyledTextInput = styled(TextInput)`
  flex: 1;
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

const OpenLargeEditorButton = styled(IconButton)`
  flex: 0;
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

const ModalContainer = styled.div`
  ${flex({ direction: 'column', justify: 'flex-start', align: 'flex-start' })};
  width: 100%;
  height: 100%;
`

const StyledListInput = styled(ListInput)`
  flex: 1;
  width: 100%;
  ${({ theme }) => theme.font('body')};
  font-size: 110%;
`


const FieldFrame = ({ title, tooltip, metaText, helpText, validationStatus, children }) => (
  <Fragment>
    <Label>
      {title}
      {tooltip ? (
        <FieldTooltip
          tooltip={<TooltipContent>{tooltip}</TooltipContent>}
          icon={{ name: 'info' }}
        />
      ) : null}
    </Label>
    {children}
    {metaText ? <MetaText>{metaText}</MetaText> : null}
    {helpText ? <HelpText>{helpText}</HelpText> : null}
    {validationStatus.error ? <StyledErrorBox error={validationStatus.error} /> : null}
  </Fragment>
)


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
  const [ largeEditorOpen, setLargeEditorOpen ] = useState(false)

  const toggleLargeEditor = useCallback(() => {
    setLargeEditorOpen(!largeEditorOpen)
  }, [ largeEditorOpen ])

  const { metaText, tooltip } = useMemo(() => {
    const { metaText: mt, tooltip: tt } = getMetaTextForInput({ type, value, config })

    return {
      metaText: mt,
      tooltip: tt,
    }
  }, [ type, value, config ])

  const frameProps = {
    title, tooltip, metaText, helpText, validationStatus
  }

  return (
    <Container className={className}>
      <FieldFrame {...frameProps}>
        <InputContainer>
          <StyledTextInput
            name={name}
            onChange={onChange}
            value={value}
            placeholder={placeholder}
            type={type}
            {...validationStatus}
          />
          {isArrayFieldType(type) ? (
            <OpenLargeEditorButton
              tooltip='Open large editor'
              icon={{ name: 'expand-alt' }}
              onClick={toggleLargeEditor}
            />
          ) : null}
        </InputContainer>
      </FieldFrame>

      <Modal isOpen={largeEditorOpen} width='80%' height='80%' onBackgroundClick={toggleLargeEditor}>
        <ModalContainer>
          <FieldFrame {...frameProps}>
            <StyledListInput
              name={name}
              onChange={onChange}
              value={value}
              placeholder={placeholder}
              type={type}
              {...validationStatus}
            />
          </FieldFrame>
        </ModalContainer>
      </Modal>

    </Container>
  )
}

export default Field
