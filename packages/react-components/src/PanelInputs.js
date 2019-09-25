/* eslint-disable-next-line import/no-extraneous-dependencies */
import React from 'react'
import styled from '@emotion/styled'

import TextInput from './TextInput'

const StyledInput = styled(TextInput)`
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
          value={inputValue[id]}
          title={config.title}
          type={config.type}
          {...inputValidation[id]}
        />
      ))}
    </>
  )
}
