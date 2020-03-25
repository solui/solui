/* eslint-disable-next-line import/no-extraneous-dependencies */
import React, { useCallback, useState, useMemo } from 'react'
import * as clipboard from 'clipboard-polyfill'
import styled from '@emotion/styled'
import { flex } from '@solui/styles'
import { parseQueryString, parseUrl } from '@solui/utils'

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

const EmbedModalBlock = styled.div`
  margin-top: 1rem;

  &:first-child {
    margin-top: 0;
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
  const shortEmbedUrl = useMemo(() => {
    if (!embedUrl) {
      return null
    }

    try {
      const { hash } = parseUrl(embedUrl)

      if (hash) {
        const qry = parseQueryString(hash.substr(1))

        if (qry.shortEmbedUrl) {
          return qry.shortEmbedUrl
        }
      }
    } catch (err) {
      console.error(`Short embed URL parsing error`, err)
    }

    return null
  })

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

  const copyToClipboard = useCallback((txt, showTooltip) => {
    clipboard.writeText(txt)
    showTooltip()
  }, [])

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

      <Modal isOpen={embedModalOpen} onBackgroundClick={closeModals} height={shortEmbedUrl ? '400px' : '250px'}>
        <ModalContainer>
          <EmbedModalBlock>
            <p>Use the following URL to view/embed this UI elsewhere:</p>
            <Textarea defaultValue={embedUrl}></Textarea>
            <Tooltip content={`Copied to clipboard`} position='top' distance={60}>
              {({ tooltipElement, flash }) => (
                <TooltipContainer>
                  <Button onClick={() => copyToClipboard(embedUrl, flash)}>
                    Copy to clipboard
                    {tooltipElement}
                  </Button>
                </TooltipContainer>
              )}
            </Tooltip>
          </EmbedModalBlock>
          {shortEmbedUrl ? (
            <EmbedModalBlock>
              <p>A shorter version that redirects to the above:</p>
              <Textarea defaultValue={shortEmbedUrl}></Textarea>
              <Tooltip content={`Copied to clipboard`} position='top' distance={60}>
                {({ tooltipElement, flash }) => (
                  <TooltipContainer>
                    <Button onClick={() => copyToClipboard(shortEmbedUrl, flash)}>
                      Copy to clipboard
                      {tooltipElement}
                    </Button>
                  </TooltipContainer>
                )}
              </Tooltip>
            </EmbedModalBlock>
          ) : null}
        </ModalContainer>
      </Modal>

      <Modal isOpen={sourceModalOpen} width='80%' height='80%' onBackgroundClick={closeModals}>
        <ModalContainer>
          <Textarea defaultValue={rawSource}></Textarea>
          <Tooltip content={`Copied to clipboard`} position='top' distance={60}>
            {({ tooltipElement, flash }) => (
              <TooltipContainer>
                <Button onClick={() => copyToClipboard(rawSource, flash)}>
                  Copy to clipboard
                  {tooltipElement}
                </Button>
              </TooltipContainer>
            )}
          </Tooltip>
        </ModalContainer>
      </Modal>
    </Container>
  )
}

export default Menu
