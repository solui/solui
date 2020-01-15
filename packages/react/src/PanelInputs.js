/* eslint-disable-next-line import/no-extraneous-dependencies */
import React, { Fragment } from 'react'
import styled from '@emotion/styled'

import Field from './Field'

const StyledField = styled(Field)`
  margin: 1.5rem 0;
`

/**
 * Render panel inputs.
 * @return {ReactElement}
 */
const PanelInputs = ({ inputs, onInputChange, inputValue, inputValidation }) => {
  return (
    <Fragment>
      {inputs.map(({ id, name, config }) => (
        <StyledField
          key={id}
          name={name}
          onChange={onInputChange[id]}
          value={inputValue[id]}
          config={config}
          validationStatus={{ ...inputValidation[id] }}
        />
      ))}
    </Fragment>
  )
}

export default PanelInputs
