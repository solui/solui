import _ from 'lodash'
import React from 'react'

const GlobalContext = React.createContext({})

export default GlobalContext

export const GlobalConsumer = GlobalContext.Consumer

export const GlobalProvider = ({ value, children }) => (
  <GlobalContext.Provider value={value}>
    {children}
  </GlobalContext.Provider>
)

export const getClientSideAppState = key => {
  if (typeof window !== 'undefined') {
    return _.get(window, `appState.${key}`)
  }

  return undefined
}
