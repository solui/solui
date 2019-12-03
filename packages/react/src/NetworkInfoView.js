/* eslint-disable-next-line import/no-extraneous-dependencies */
import React from 'react'
import styled from '@emotion/styled'

import Tooltip from './Tooltip'
import Icon from './Icon'

const Container = styled.div`
  ${({ theme }) => theme.font('body', 'thin')};
  color: ${({ theme }) => theme.networkInfoIconColor};

  span {
    ${({ theme }) => theme.font('body', 'bold')};
    color: ${({ theme }) => theme.networkInfoTextColor};
    margin-left: 5px;
  }
`

/**
 * Render network info.
 * @return {ReactElement}
 */
const NetworkInfoView = ({ className, network: { id, name } }) => (
  <Tooltip text={`Connected to network: ${name} (${id})`} position='bottom'>
    {({ tooltipElement, show, hide }) => (
      <Container
        className={className}
        onMouseOver={show}
        onMouseOut={hide}
      >
        <Icon name='network-wired' />
        {tooltipElement}
        <span>{name}</span>
      </Container>
    )}
  </Tooltip>
)

export default NetworkInfoView
