import React, { useRef, useCallback } from 'react'
import styled from '@emotion/styled'
import { smoothTransitions, boxShadow } from '@solui/styles'

import Icon from './Icon'
import Tooltip from './Tooltip'


const IconButton = styled.button`
  ${smoothTransitions()};
  ${({ theme }) => theme.font('body', 'bold')};
  cursor: pointer;
  border: 1px solid ${({ theme, disabled }) => (disabled ? theme.iconButtonDisabledBorderColor : theme.iconButtonBorderColor)};
  background-color: ${({ theme, disabled }) => (disabled ? theme.iconButtonDisabledBgColor : theme.iconButtonBgColor)};
  color: ${({ theme, disabled }) => (disabled ? theme.iconButtonDisabledTextColor : theme.iconButtonTextColor)};
  padding: 0.2em 0.5em;
  border-radius: 5px;
  font-size: 1rem;
  outline: none;
  ${({ disabled, theme }) => (disabled ? '' : `
    &:hover {
      border-color: ${theme.iconButtonHoverBorderColor};
      background-color: ${theme.iconButtonHoverBgColor};
      color: ${theme.iconButtonHoverTextColor};
      ${boxShadow({ color: theme.iconButtonShadowColor })};
    }
  `)}
`

export default ({ icon, title, ...props }) => {
  const tooltipRef = useRef(null)

  const onMouseOver = useCallback(() => tooltipRef.current.show(), [ tooltipRef ])
  const onMouseOut = useCallback(() => tooltipRef.current.hide(), [ tooltipRef ])

  return (
    <Tooltip text={title} ref={tooltipRef}>
      {({ tooltipElement }) => (
        <IconButton
          {...props}
          onMouseOver={onMouseOver}
          onMouseOut={onMouseOut}
        >
          <Icon {...icon} />
          {tooltipElement}
        </IconButton>
      )}
    </Tooltip>
  )
}
