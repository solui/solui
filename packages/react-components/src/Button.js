/* eslint-disable-next-line import/no-extraneous-dependencies */
import React from 'react'
import styled from '@emotion/styled'
import { smoothTransitions, boxShadow } from '@solui/styles'

import LoadingIcon from './LoadingIcon'

const StyledButton = styled.button`
  ${smoothTransitions()};
  ${({ theme }) => theme.font('body', 'bold')};
  cursor: pointer;
  border: 1px solid ${({ theme, disabled }) => (disabled ? theme.buttonDisabledBorderColor : theme.buttonBorderColor)};
  background-color: ${({ theme, disabled }) => (disabled ? theme.buttonDisabledBgColor : theme.buttonBgColor)};
  color: ${({ theme, disabled }) => (disabled ? theme.buttonDisabledTextColor : theme.buttonTextColor)};
  padding: 1em 2em;
  font-size: 1rem;
  outline: none;
  ${({ disabled, theme }) => (disabled ? '' : `
    &:hover {
      border-color: ${theme.buttonHoverBorderColor};
      background-color: ${theme.buttonHoverBgColor};
      color: ${theme.buttonHoverTextColor};
      ${boxShadow({ color: theme.buttonShadowColor })};
    }
  `)}
`

const StyledLoadingIcon = styled(LoadingIcon)`
  color: ${({ theme }) => theme.buttonTextColor};
`

export default ({ loading, children, ...props }) => (
  <StyledButton {...props}>
    {loading ? (
      <StyledLoadingIcon />
    ) : (
      children
    )}
  </StyledButton>
)
