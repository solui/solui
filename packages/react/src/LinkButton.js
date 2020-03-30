/* eslint-disable-next-line import/no-extraneous-dependencies */
import React, { forwardRef } from 'react'
import styled from '@emotion/styled'
import { buttonStyles } from '@solui/styles'

const StyledButton = styled.button`
  ${({ theme, disabled }) => buttonStyles({
    theme,
    disabled,
    buttonDisabledBgColor: theme.linkButtonDisabledBgColor,
    buttonDisabledTextColor: theme.linkButtonDisabledTextColor,
    buttonDisabledBorderColor: theme.linkButtonDisabledBorderColor,
    buttonBgColor: theme.linkButtonBgColor,
    buttonTextColor: theme.linkButtonTextColor,
    buttonBorderColor: theme.linkButtonBorderColor,
    buttonHoverBgColor: theme.linkButtonHoverBgColor,
    buttonHoverTextColor: theme.linkButtonHoverTextColor,
    buttonHoverBorderColor: theme.linkButtonHoverBorderColor,
    buttonShadowColor: theme.linkButtonShadowColor,
  })};

  font: inherit;
  padding: 0;
`

/**
 * Render a button that looks like a link.
 * @return {ReactElement}
 */
const LinkButton = forwardRef(({ children, ...props }, ref) => (
  <StyledButton {...props} ref={ref}>
    {children}
  </StyledButton>
))

export default LinkButton
