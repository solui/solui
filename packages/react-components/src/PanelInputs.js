/* eslint-disable-next-line import/no-extraneous-dependencies */
import React from 'react'
import styled from '@emotion/styled'

import Field from './Field'
import TextInput from './TextInput'

const StyledField = styled(Field)`
  margin: 1.5rem 0;
`

export default ({ inputs, onInputChange, inputValue, inputValidation }) => {
  return (
    <>
      {inputs.map(({ id, name, config }) => (
        <StyledField
          key={id}
          title={config.title}
          {...inputValidation[id]}
        >
          <TextInput
            name={name}
            onChange={onInputChange[id]}
            value={inputValue[id]}
            type={config.type}
            {...inputValidation[id]}
          />
        </StyledField>
      ))}
    </>
  )
}
