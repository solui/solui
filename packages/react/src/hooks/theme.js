import React from 'react'
import { ThemeContext } from '@emotion/core'

export const useTheme = () => {
  return React.useContext(ThemeContext)
}
