/* eslint-disable-next-line import/no-extraneous-dependencies */
import React from 'react'
import styled from '@emotion/styled'

import Input from './Input'

const StyledInput = styled(Input)`
  margin: 1.5rem 0;
`

export default ({ inputs, onInputChange, inputValue, inputValidation }) => {
  return (
    <>
      {inputs.map(({ id, name, config }) => (
        <StyledInput
          key={id}
          name={name}
          onChange={onInputChange[id]}
          config={config}
          value={inputValue[id]}
          {...inputValidation[id]}
        />
      ))}
    </>
  )
}
