import { useReducer, useMemo, useEffect } from 'react'

const inputIsEmpty = val => (val === null || val === undefined || val === '' || (Array.isArray(val) && !val.length))

export const inputValueReducer = (state, { id, value }) => {
  if (state[id] !== value) {
    return { ...state, [id]: value }
  } else {
    return state
  }
}

export const inputValidationReducer = (state, { id, valid, error }) => {
  if (JSON.stringify(state[id]) !== JSON.stringify({ valid, error })) {
    return { ...state, [id]: { valid, error } }
  } else {
    return state
  }
}


export const createInitialInputValueState = inputs => (
  inputs.reduce((m, { id, config: { initialValue } }) => {
    m[id] = initialValue || ''
    return m
  }, {})
)

export const createInitialInputValidationState = inputs => (
  inputs.reduce((m, { id }) => {
    m[id] = { valid: false }
    return m
  }, {})
)

export const useInputHooks = ({ inputs, validate }) => {
  // reducers
  const [ inputValue, updateInputValue ] = useReducer(
    inputValueReducer, inputs, createInitialInputValueState
  )
  const [ inputValidation, updateInputValidation ] = useReducer(
    inputValidationReducer, inputs, createInitialInputValidationState
  )

  const onInputChange = useMemo(() => (
    inputs.reduce((m, { id }) => {
      m[id] = value => {
        updateInputValue({ id, value })
      }
      return m
    }, {})
  ), [ updateInputValue, inputs ])

  // check input validity
  const allInputsAreValid = useMemo(() => (
    Object.values(inputValidation).reduce((m, { valid }) => m && valid, true)
  ), [ inputValidation ])

  // validation takes place asynchronously
  useEffect(() => {
    (async () => {
      let errorDetails = {}

      try {
        await validate(inputValue)
      } catch (err) {
        errorDetails = err.details || {}
      }

      // update validation results for all inputs
      Object.keys(inputValue).forEach(inputId => {
        if (inputIsEmpty(inputValue[inputId])) {
          updateInputValidation({ id: inputId, valid: false, error: null })
        } else if (errorDetails[inputId]) {
          updateInputValidation({ id: inputId, valid: false, error: errorDetails[inputId] })
        } else {
          updateInputValidation({ id: inputId, valid: true })
        }
      })
    })()
  }, /*
    important to only run this when input values change, not when validation
    state changes, otherwise we may end up in infinite loop
   */
  [ validate, inputValue, updateInputValidation ])

  return {
    inputValue,
    updateInputValue,
    inputValidation,
    updateInputValidation,
    allInputsAreValid,
    onInputChange,
  }
}
