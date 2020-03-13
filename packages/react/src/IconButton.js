/* eslint-disable-next-line import/no-extraneous-dependencies */
import React, { Fragment } from 'react'
import styled from '@emotion/styled'
import { buttonStyles } from '@solui/styles'

import Icon from './Icon'
import Tooltip from './Tooltip'


const StyledButton = styled.button`
  ${({ theme, disabled }) => buttonStyles({
    theme,
    disabled,
    buttonDisabledBgColor: theme.iconButtonDisabledBgColor,
    buttonDisabledTextColor: theme.iconButtonDisabledTextColor,
    buttonDisabledBorderColor: theme.iconButtonDisabledBorderColor,
    buttonBgColor: theme.iconButtonBgColor,
    buttonTextColor: theme.iconButtonTextColor,
    buttonBorderColor: theme.iconButtonBorderColor,
    buttonHoverBgColor: theme.iconButtonHoverBgColor,
    buttonHoverTextColor: theme.iconButtonHoverTextColor,
    buttonHoverBorderColor: theme.iconButtonHoverBorderColor,
    buttonShadowColor: theme.iconButtonShadowColor,
  })}
  cursor: ${({ onClick }) => (onClick ? 'pointer' : 'default')};
  padding: 0.2em 0.6em;
  font-size: 0.9rem;
  border-radius: 1rem;
`

/**
 * Render an icon button.
 * @return {ReactElement}
 * @see {Icon}
 */
const IconButton = ({ icon, tooltip, ...props }) => {
  return (
    <Fragment>
      <Tooltip content={tooltip}>
        {({ tooltipElement, show, hide }) => (
          <StyledButton
            {...props}
            onMouseOver={show}
            onMouseOut={hide}
          >
            <Icon {...icon} />
            {tooltipElement}
          </StyledButton>
        )}
      </Tooltip>
    </Fragment>
  )
}

export default IconButton
