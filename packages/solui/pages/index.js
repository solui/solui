import React from 'react'

export default ({ appState }) => (
  <div>
    <span>UI: {JSON.stringify(appState.ui)}</span>
  </div>
)
