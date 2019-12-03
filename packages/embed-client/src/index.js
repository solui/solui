import ReactDOM from 'react-dom'
import React from 'react'
import { AppContainer } from '@solui/react'
import { process as processSpec, validateGroupInputs, validatePanel, executePanel } from '@solui/processor'

class App extends AppContainer {
  render () {
    const { network, renderingError } = this.state
    const { hash } = this.props

    let error

    if (!hash) {
      error = 'No valid UI specified'
    } else if (renderingError) {
      error = renderingError
    }

    return this._render({ error, network }, {
      spec: {},
      artifacts: {},
      processSpec,
      validateGroupInputs,
      validatePanel,
      executePanel,
    })
  }
}

ReactDOM.render(<App hash={window.location.hash} />, document.getElementById('root'))
