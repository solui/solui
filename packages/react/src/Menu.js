/* eslint-disable-next-line import/no-extraneous-dependencies */
import React, { useCallback, useState, useMemo } from 'react'
import * as clipboard from 'clipboard-polyfill'
import styled from '@emotion/styled'
import { flex } from '@solui/styles'

import { Modal } from './Modal'
import Tooltip from './Tooltip'
import Button from './Button'
import Icon from './Icon'

const Container = styled.div`
  ${flex({ direction: 'row', justify: 'flex-start', align: 'center' })};
`

const ModalContainer = styled.div`
  ${flex({ direction: 'column', justify: 'flex-start', align: 'center' })};
  width: 100%;
  height: 100%;

  p {
    ${({ theme }) => theme.font('body')};
    margin-bottom: 1rem;
    text-align: left;
  }
`

const MenuButton = styled(Button)`
  ${({ theme }) => theme.font('body', 'thin')};
  color: ${({ theme }) => theme.menuButtonTextColor};
  background-color: ${({ theme }) => theme.menuButtonBgColor};
  border: none;
  cursor: pointer;
  margin-right: 1rem;
`

const ShareButton = styled(MenuButton)``
const ViewSourceButton = styled(MenuButton)``
const AbouButton = styled(MenuButton)``

const ButtonIcon = styled(Icon)`
  margin-right: 0.5rem;
`

const Textarea = styled.textarea`
  flex: 1;
  width: 100%;
  ${({ theme }) => theme.font('body')};
  font-size: 110%;
  margin-bottom: 1rem;
`

const TooltipContainer = styled.div`
  ${flex({ direction: 'column', justify: 'center', align: 'center', basis: '0' })};
`

/**
 * Render embed label.
 * @return {ReactElement}
 */
const Menu = ({ className, embedUrl, spec, artifacts }) => {
  const [ embedModalOpen, setEmbedModalOpen ] = useState(false)
  const [ sourceModalOpen, setSourceModalOpen ] = useState(false)

  const rawSource = useMemo(() => JSON.stringify({ spec, artifacts }, null, 2), [ spec, artifacts ])
  const aboutUrl = useMemo(() => (spec ? spec.aboutUrl : null), [ spec ])

  const viewAboutThisApp = useCallback(() => {
    if (aboutUrl) {
      window.open(aboutUrl, '_blank')
    }
  }, [ aboutUrl ])

  const viewEmbedUrl = useCallback(() => {
    setEmbedModalOpen(true)
  }, [])

  const viewRawSource = useCallback(() => {
    setSourceModalOpen(true)
  }, [])

  const copyEmbedUrlToClipboard = useCallback(tooltip => {
    clipboard.writeText(embedUrl)
    tooltip.flash()
  }, [ embedUrl ])

  const copySourceToClipboard = useCallback(tooltip => {
    clipboard.writeText(rawSource)
    tooltip.flash()
  }, [ rawSource ])

  const closeModals = useCallback(() => {
    setEmbedModalOpen(false)
    setSourceModalOpen(false)
  }, [])

  return (
    <Container className={className}>
      <ViewSourceButton onClick={viewRawSource}><ButtonIcon name='eye' />View source</ViewSourceButton>

      {embedUrl ? (
        <ShareButton onClick={viewEmbedUrl}><ButtonIcon name='share-alt-square' />Share and embed</ShareButton>
      ) : null}

      {aboutUrl ? (
        <AbouButton onClick={viewAboutThisApp}><ButtonIcon name='home' />About this app</AbouButton>
      ) : null}

      <Modal isOpen={embedModalOpen} onBackgroundClick={closeModals}>
        <ModalContainer>
          <p>Use the following URL to view/embed this UI elsewhere:</p>
          <Textarea defaultValue={embedUrl}></Textarea>
          <Tooltip text={`Copied to clipboard`} position='bottom'>
            {({ tooltipElement, flash }) => (
              <TooltipContainer>
                <Button onClick={() => copyEmbedUrlToClipboard({ flash })}>
                  Copy to clipboard
                </Button>
                {tooltipElement}
              </TooltipContainer>
            )}
          </Tooltip>
        </ModalContainer>
      </Modal>

      <Modal isOpen={sourceModalOpen} width='80%' height='80%' onBackgroundClick={closeModals}>
        <ModalContainer>
          <Textarea defaultValue={rawSource}></Textarea>
          <Tooltip text={`Copied to clipboard`} position='bottom'>
            {({ tooltipElement, flash }) => (
              <TooltipContainer>
                <Button onClick={() => copySourceToClipboard({ flash })}>
                  Copy to clipboard
                </Button>
                {tooltipElement}
              </TooltipContainer>
            )}
          </Tooltip>
        </ModalContainer>
      </Modal>
    </Container>
  )
}

export default Menu
