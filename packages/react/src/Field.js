/* eslint-disable-next-line import/no-extraneous-dependencies */
import React, { Fragment, useMemo, useState, useCallback } from 'react'
import styled from '@emotion/styled'
import { flex } from '@solui/styles'

import ErrorBox from './ErrorBox'
import { Modal } from './Modal'
import IconButton from './IconButton'
import Dropdown from './Dropdown'
import TextInput from './TextInput'
import ListInput from './ListInput'
import { isArrayFieldType, getMetaTextForInput } from './utils'

const Container = styled.div`
  ${flex({ justify: 'flex-start', align: 'flex-start' })};
`

const InputContainer = styled.div`
  ${flex({ direction: 'row', justify: 'space-around', align: 'center' })};
  position: relative;
  width: 100%;
`

const StyledTextInput = styled(TextInput)`
  flex: 1;
`

const LabelDiv = styled.div`
  ${flex({ direction: 'row', justify: 'space-between', align: 'center' })};
  flex: 0;
  width: 100%;
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

const OptionalText = styled.div`
  ${({ theme }) => theme.font('body', 'regular', 'italic')};
  font-size: 0.8rem;
  padding-left: 1em;
`

const FieldEmbeddedButtonsContainer = styled.div`
  ${flex({ direction: 'row', justify: 'space-around', align: 'center' })};
  position: absolute;
  right: 10px;
`

const FieldEmbeddedButton = styled(IconButton)`
  background-color: ${({ theme }) => theme.inputBgColor};
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
`


const FieldFrame = ({ title, tooltip, metaText, helpText, validationStatus, optional, children }) => (
  <Fragment>
    <LabelDiv>
      <Label>
        {title}
        {tooltip ? (
          <FieldTooltip
            tooltip={<TooltipContent>{tooltip}</TooltipContent>}
            icon={{ name: 'info' }}
          />
        ) : null}
      </Label>
      {optional ? <OptionalText>optional</OptionalText> : null}
    </LabelDiv>
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
  config: { title, optional, type, resolvedOptions, helpText, placeholder, ...config },
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

  const showEmbeddedButtons = useMemo(() => {
    return resolvedOptions || isArrayFieldType(type)
  }, [ type, resolvedOptions ])

  const frameProps = {
    title, tooltip, metaText, helpText, validationStatus, optional
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

          {showEmbeddedButtons ? (
            <FieldEmbeddedButtonsContainer>
              {resolvedOptions ? (
                <Dropdown
                  options={resolvedOptions}
                  selectedOption={value}
                  onSelect={onChange}
                />
              ) : null}
              {isArrayFieldType(type) ? (
                <FieldEmbeddedButton
                  tooltip='Open larger editor'
                  icon={{ name: 'expand-alt' }}
                  onClick={toggleLargeEditor}
                />
              ) : null}
            </FieldEmbeddedButtonsContainer>
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
