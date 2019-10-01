import React from 'react'
import { process as processSpec, validateGroupInputs, validatePanel, executePanel } from '@solui/processor'
import { Layout, Dapp } from '@solui/react-components'

export default ({ network, appState: { spec, artifacts } }) => {
  return (
    <Layout>
      <Dapp
        network={network}
        spec={spec}
        artifacts={artifacts}
        processSpec={processSpec}
        validateGroupInputs={validateGroupInputs}
        validatePanel={validatePanel}
        executePanel={executePanel}
      />
    </Layout>
  )
}
