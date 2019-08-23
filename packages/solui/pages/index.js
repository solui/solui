import React from 'react'
import styled from '@emotion/styled'

import Layout from './components/Layout'

const Segments = styled.ul`
  list-style: none;
`

const Segment = styled.li`
  display: block;
`

export default ({ appState: { ui } }) => (
  <Layout>
    <Segments>
      {Object.keys(ui).map(id => (
        <Segment key={id}>{id}</Segment>
      ))}
    </Segments>
  </Layout>
)
