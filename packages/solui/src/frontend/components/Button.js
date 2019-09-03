import styled from '@emotion/styled'

import { smoothTransitions, boxShadow } from '../styles/fragments'
import { roboto } from '../styles/fonts'

const Button = styled.button`
  ${smoothTransitions()};
  ${roboto('bold')};
  cursor: pointer;
  border: 1px solid ${({ theme }) => theme.buttonBorderColor};
  background-color: ${({ theme, disabled }) => (disabled ? theme.buttonDisabledBgColor : theme.buttonBgColor)};
  padding: 1em 2em;
  font-size: 1rem;
  color: ${({ theme, disabled }) => (disabled ? theme.buttonDisabledTextColor : theme.buttonTextColor)};
  outline: none;
  ${({ disabled, theme }) => (disabled ? '' : `
    &:hover {
      background-color: ${theme.buttonHoverBgColor};
      color: ${theme.buttonHoverTextColor};
      ${boxShadow({ color: theme.buttonShadowColor })};
    }
  `)}
`

export default Button
