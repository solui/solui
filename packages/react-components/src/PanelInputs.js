/* eslint-disable-next-line import/no-extraneous-dependencies */
import React from 'react'
import styled from '@emotion/styled'

import Field from './Field'

const StyledField = styled(Field)`
  margin: 1.5rem 0;
`

export default ({ inputs, onInputChange, inputValue, inputValidation }) => {
  return (
    <>
      {inputs.map(({ id, name, config }) => (
        <StyledField
          key={id}
          name={name}
          onChange={onInputChange[id]}
          value={inputValue[id]}
          title={config.title}
          type={config.type}
          validationStatus={{ ...inputValidation[id] }}
          validationConfig={{ ...config }}
        />
      ))}
    </>
  )
}
