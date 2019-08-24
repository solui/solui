import React from 'react'
import styled from '@emotion/styled'

const Container = styled.div``

export default ({ network: { id, name } }) => (
  <Container>
    You are connected to network: {name} ({id})
  </Container>
)
