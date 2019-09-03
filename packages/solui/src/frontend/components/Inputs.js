import React from 'react'
import styled from '@emotion/styled'

import { GlobalContext } from '../_global'
import Input from './Input'

const StyledInput = styled(Input)`
  margin: 1rem 0;
`

export default ({ inputs, onInputChange, inputValue, inputValidation }) => {
  return (
    <GlobalContext.Consumer>
      {({ network }) => inputs.map(({ id, name, config }) => (
        <StyledInput
          key={id}
          name={name}
          onChange={onInputChange[id]}
          config={config}
          network={network}
          value={inputValue[id]}
          {...inputValidation[id]}
        />
      ))}
    </GlobalContext.Consumer>
  )
}
