/* eslint-disable-next-line import/no-extraneous-dependencies */
import { useReducer, useMemo, useEffect } from 'react'

const inputIsEmpty = val => (val === null || val === undefined || val === '' || (Array.isArray(val) && !val.length))

const inputValueReducer = (state, { id, value }) => {
  if (state[id] !== value) {
    return { ...state, [id]: value }
  } else {
    return state
  }
}

const inputValidationReducer = (state, { id, valid, error }) => {
  if (JSON.stringify(state[id]) !== JSON.stringify({ valid, error })) {
    return { ...state, [id]: { valid, error } }
  } else {
    return state
  }
}


const createInitialInputValueState = inputs => (
  inputs.reduce((m, { id, config: { resolvedInitialValue } }) => {
    m[id] = resolvedInitialValue || ''
    return m
  }, {})
)

const createInitialInputValidationState = inputs => (
  inputs.reduce((m, { id }) => {
    m[id] = { valid: false }
    return m
  }, {})
)


/**
 * Hook for handling user-input values.
 *
 * This will expose funtions for change handling, validation and post-validation
 * error handling.
 *
 * @param  {Array} inputs   Input field configurations
 * @param  {Function} validate Callback to validate input values.
 *
 * @return {UseInputHookStruct}
 */
export const useInput = ({ inputs, validate }) => {
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

  const isOptional = useMemo(() => inputId => (
    inputs.reduce((m, { id, config: { optional } }) => m || (id === inputId && !!optional), false)
  ), [ inputs ])

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
        if (inputIsEmpty(inputValue[inputId]) && !isOptional(inputId)) {
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

/**
 * @typedef {Object} UseInputHookStruct
 * @property {Object} inputValue Current input values
 * @property {Function} updateInputValue Callback to update input value.
 * @property {Object} inputValidation Current input validation status.
 * @property {Function} updateInputValidation Current to update input validation status.
 * @property {Boolean} allInputsAreValid Flag indicating whether all inputs are currently valid.
 * @property {Function} onInputChange Callback for when input changes.
 */
