import React from 'react'
import ReactSVG from 'react-svg'
import styled from '@emotion/styled'

const Container = styled.div`
  overflow: hidden;
`

const Img = styled.img`
  max-width: 100%;
  max-height: 100%;
`

export default ({ className, url }) => (
  <Container className={className}>
    {url.endsWith('.svg') ? (
      <ReactSVG src={url} />
    ) : (
      <Img src={url} />
    )}
  </Container>
)
