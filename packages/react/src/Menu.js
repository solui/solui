/* eslint-disable-next-line import/no-extraneous-dependencies */
import React, { useCallback, useState, useMemo } from 'react'
import * as clipboard from 'clipboard-polyfill'
import styled from '@emotion/styled'
import { flex, boxShadow } from '@solui/styles'

import { Modal } from './Modal'
import Tooltip from './Tooltip'
import Button from './Button'
import Icon from './Icon'

const Container = styled.div`
  position: relative;
  ${({ theme }) => theme.font('body', 'thin')};
  color: ${({ theme }) => theme.menuIconColor};
  cursor: pointer;
`

const MenuDiv = styled.ul`
  position: absolute;
  list-style: none;
  top: 1.5rem;
  right: 0;
  z-index: 2;
  background-color: ${({ theme }) => theme.menuBgColor};
  ${({ theme }) => boxShadow({ color: theme.menuShadowColor })};
  border-radius: 5px;
  width: 10rem;

  li {
    padding: 0.5rem 1rem;
    &:hover {
      color: ${({ theme }) => theme.menuItemHoverTextColor};
      background-color: ${({ theme }) => theme.menuItemHoverBgColor};
    }
  }
`

const ModalContainer = styled.div`
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
const Menu = ({ className, embedUrl, spec, artifacts }) => {
  const [ embedModalOpen, setEmbedModalOpen ] = useState(false)
  const [ sourceModalOpen, setSourceModalOpen ] = useState(false)
  const [ menuOpen, setMenuOpen ] = useState(false)

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

  const copyEmbedUrlToClipboard = useCallback(() => {
    clipboard.writeText(embedUrl)
    setEmbedModalOpen(false)
  }, [ embedUrl ])

  const copySourceToClipboard = useCallback(() => {
    clipboard.writeText(rawSource)
    setSourceModalOpen(false)
  }, [ rawSource ])

  const toggleMenu = useCallback(() => setMenuOpen(!menuOpen), [ menuOpen ])

  return (
    <Tooltip text={`View menu`} position='bottom'>
      {({ tooltipElement, show, hide }) => (
        <Container
          className={className}
          onClick={toggleMenu}
        >
          <Icon name='cogs' onMouseOver={show} onMouseOut={hide} />
          {tooltipElement}
          {menuOpen ? (
            <MenuDiv>
              {embedUrl ? <li onClick={viewEmbedUrl}>Share and embed</li> : null}
              <li onClick={viewRawSource}>View raw source</li>
              {aboutUrl ? <li onClick={viewAboutThisApp}>About this app</li> : null}
            </MenuDiv>
          ) : null}
          <Modal isOpen={embedModalOpen} onBackgroundClick={() => { }}>
            <ModalContainer>
              <p>Use the following URL to view/embed this UI elsewhere:</p>
              <textarea cols="4" rows="4" defaultValue={embedUrl}></textarea>
              <Button onClick={copyEmbedUrlToClipboard}>Copy to clipboard</Button>
            </ModalContainer>
          </Modal>
          <Modal isOpen={sourceModalOpen} onBackgroundClick={() => { }} >
            <ModalContainer>
              <textarea cols="4" rows="7" defaultValue={rawSource}></textarea>
              <Button onClick={copySourceToClipboard}>Copy to clipboard</Button>
            </ModalContainer>
          </Modal>
        </Container>
      )}
    </Tooltip>
  )
}

export default Menu
