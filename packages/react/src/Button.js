/* eslint-disable-next-line import/no-extraneous-dependencies */
import React, { forwardRef } from 'react'
import styled from '@emotion/styled'
import { buttonStyles } from '@solui/styles'

import LoadingIcon from './LoadingIcon'

const StyledButton = styled.button`
  ${({ theme, disabled }) => buttonStyles({
    theme,
    disabled,
    buttonDisabledBgColor: theme.buttonDisabledBgColor,
    buttonDisabledTextColor: theme.buttonDisabledTextColor,
    buttonDisabledBorderColor: theme.buttonDisabledBorderColor,
    buttonBgColor: theme.buttonBgColor,
    buttonTextColor: theme.buttonTextColor,
    buttonBorderColor: theme.buttonBorderColor,
    buttonHoverBgColor: theme.buttonHoverBgColor,
    buttonHoverTextColor: theme.buttonHoverTextColor,
    buttonHoverBorderColor: theme.buttonHoverBorderColor,
    buttonShadowColor: theme.buttonShadowColor,
  })};
`

const StyledLoadingIcon = styled(LoadingIcon)`
  color: ${({ theme }) => theme.buttonTextColor};
`

/**
 * Render a button.
 * @return {ReactElement}
 */
const Button = forwardRef(({ loading, children, onClick, ...props }, ref) => (
  <StyledButton {...props} onClick={loading ? null : onClick} ref={ref}>
    {loading ? (
      <StyledLoadingIcon />
    ) : (
      children
    )}
  </StyledButton>
))

export default Button
