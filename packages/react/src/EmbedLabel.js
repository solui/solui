/* eslint-disable-next-line import/no-extraneous-dependencies */
import React, { useMemo, useState, useCallback } from 'react'
import * as clipboard from 'clipboard-polyfill'
import styled from '@emotion/styled'
import { flex } from '@solui/styles'

import { Modal } from './Modal'
import Tooltip from './Tooltip'
import Button from './Button'
import Icon from './Icon'

const Container = styled.div`
  ${({ theme }) => theme.font('body', 'thin')};
  color: ${({ theme }) => theme.networkInfoIconColor};
  cursor: pointer;

  span {
    ${({ theme }) => theme.font('body', 'bold')};
    color: ${({ theme }) => theme.networkInfoTextColor};
    margin-left: 5px;
  }
`

const EmbedContainer = styled.div`
  ${flex({ direction: 'column', justify: 'flex-start', align: 'center' })};

  p {
    ${({ theme }) => theme.font('body')};
    margin-bottom: 1rem;
    text-align: left;
  }

  textarea {
    width: 100%;
    ${({ theme }) => theme.font('body')};
    font-size: 110%;
    margin-bottom: 1rem;
  }
`

/**
 * Render embed label.
 * @return {ReactElement}
 */
const EmbedLabel = ({ className, embedUrl }) => {
  const [ modalOpen, setModalOpen ] = useState(false)

  const toggleModal = useCallback(() => {
    setModalOpen(!modalOpen)
  }, [ modalOpen ])

  const embedCode = useMemo(() => {
    return `<iframe src=${embedUrl} width="640" height="480" />`
  }, [ embedUrl ])

  const copyToClipboard = useCallback(({ show, hide }) => {
    clipboard.writeText(embedCode)
    setModalOpen(false)
    show()
    setTimeout(() => hide(), 2000)
  }, [ embedCode ])

  return (
    <Tooltip text={`Copied to clipboard`} position='bottom'>
      {({ tooltipElement, show, hide }) => (
        <Container
          className={className}
          onClick={toggleModal}
        >
          <Icon name='share-alt-square' />
          {tooltipElement}
          <span>Share</span>
          <Modal
            isOpen={modalOpen}
            onBackgroundClick={() => {}}
          >
            <EmbedContainer>
              <p>Use the following code to embed this UI into your page:</p>
              <textarea cols="4" rows="4" defaultValue={embedCode}></textarea>
              <Button onClick={() => copyToClipboard({ show, hide })}>Copy to clipboard</Button>
            </EmbedContainer>
          </Modal>
        </Container>
      )}
    </Tooltip>
  )
}

export default EmbedLabel
