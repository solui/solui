/* eslint-disable-next-line import/no-extraneous-dependencies */
import React, { useCallback } from 'react'
import ReactSVG from 'react-svg'
import styled from '@emotion/styled'

const Container = styled.div`
  overflow: hidden;
`

const Img = styled.img`
  max-width: 100%;
  max-height: 100%;
`

/**
 * Render an image.
 * @return {ReactElement}
 */
const Image = ({ className, url }) => {
  const svgBeforeInjection = useCallback(svg => {
    svg.setAttribute('width', '100%')
    svg.setAttribute('height', '100%')
  }, [])

  return (
    <Container className={className}>
      {url.endsWith('.svg') ? (
        <ReactSVG
          src={url}
          beforeInjection={svgBeforeInjection}
        />
      ) : (
        <Img src={url} />
      )}
    </Container>
  )
}

export default Image
