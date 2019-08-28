import React from 'react'

import { GlobalContext } from '../_global'
import Input from './Input'

export default ({ inputs, onInputChange, inputValue, inputValidation }) => {
  return (
    <GlobalContext.Consumer>
      {({ network }) => inputs.map(({ id, name, config }) => (
        <Input
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
