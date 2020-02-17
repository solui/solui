/* eslint-disable-next-line import/no-extraneous-dependencies */
import { useReducer } from 'react'

const panelHistoryReducer = (state, data) => {
  return state.concat([{
    ts: Date.now(),
    ...data,
  }])
}

/**
 * Hook for handling execution history.
 *
 * @return {useExecutionHistoryStruct}
 */
export const useExecutionHistory = () => {
  const [ executionHistory, saveExecutionToHistory ] = useReducer(
    panelHistoryReducer, [], () => []
  )

  return { executionHistory, saveExecutionToHistory }
}


/**
 * @typedef {Object} useExecutionHistory
 * @property {Array} executionHistory The execution history. Each item contains: { inputs, tx, outputs, error }
 * @property {Function} saveExecutionToHistory Save an execution to history.
 */
