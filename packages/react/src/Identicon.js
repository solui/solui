import React, { useMemo, useEffect } from 'react'
import styled from '@emotion/styled'
import IdenticonCreator from 'identicon.js'
import { _ } from '@solui/utils'

import Tooltip from './Tooltip'

const Container = styled.div`
  width: 32px;
  height: 32px;
  img {
    width: 100%;
    height: 100%;
  }
`

const Identicon = ({ className, tooltip, hash, hideTooltip }) => {
  const imgCode = useMemo(() => {
    return new IdenticonCreator(hash, {
      size: 128,
      background: [ 255, 255, 255, 255 ],
    }).toString()
  }, [ hash ])

  return (
    <Tooltip content={hideTooltip ? null : (tooltip || hash)}>
      {({ tooltipElement, show, hide }) => (
        <Container
          className={className}
          onMouseOver={show}
          onMouseOut={hide}
        >
          <img src={`data:image/png;base64,${imgCode}`} />
          {tooltipElement}
          </Container>
      )}
    </Tooltip>
  )
}

export default Identicon
