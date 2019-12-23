import ReactDOM from 'react-dom'
import React, { useMemo } from 'react'
import qs from 'query-string'
import { useAsync } from 'react-async-hook'
import { AppContainer } from '@solui/react'
import { _ } from '@solui/utils'
import { process as processSpec, validateGroupInputs, validatePanel, executePanel } from '@solui/processor'

const fetchSpec = async url => {
  if (!url) {
    throw new Error(`Invalid location: ${url}`)
  }
  return (await fetch(url)).json()
}

class App extends AppContainer {
  render () {
    const { network, renderingError } = this.state
    const { spec, artifacts, theme, error, loading, embedUrl } = this.props

    return this._render({
      network,
      error: renderingError || error,
      loading,
    }, {
      spec,
      artifacts,
      theme,
      processSpec,
      validateGroupInputs,
      validatePanel,
      executePanel,
      embedUrl,
    })
  }
}

const Bootstrap = ({ hash }) => {
  const { loc, theme } = useMemo(() => {
    const str = (hash ? hash.substr(1) : '')
    try {
      const q = qs.parse(str)

      if (!q) {
        return {}
      }

      if (!q.l) {
        return {}
      }

      if (!q.l.startsWith('http')) {
        q.l = `https://gateway.temporal.cloud/ipfs/${q.l}`
      }

      const { l, ...s } = q

      return {
        loc: l,
        theme: s,
      }
    } catch (err) {
      return null
    }
  }, [ hash ])

  const asyncSpec = useAsync(fetchSpec, [ loc ])

  const loading = !!_.get(asyncSpec, 'loading')
  const { spec, artifacts } = _.get(asyncSpec, 'result', {})

  const error = _.get(asyncSpec, 'error')
  const fetchError = error ? `Error fetching UI (${error.message})` : null

  return (
    <App
      spec={spec}
      artifacts={artifacts}
      theme={theme}
      loading={loading}
      error={asyncSpec ? fetchError : 'No UI specified'}
      embedUrl={window.location.href}
    />
  )
}

ReactDOM.render(<Bootstrap hash={window.location.hash} />, document.getElementById('root'))
