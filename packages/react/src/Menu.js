/* eslint-disable-next-line import/no-extraneous-dependencies */
import React, { useCallback, useState } from 'react'
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
const Menu = ({ className, embedUrl, sourceUrl }) => {
  const [ modalOpen, setModalOpen ] = useState(false)
  const [ menuOpen, setMenuOpen ] = useState(false)

  const viewSourceCode = useCallback(() => {
    window.open(sourceUrl, '_blank')
  }, [ sourceUrl ])

  const showEmbedModal = useCallback(() => {
    setModalOpen(true)
  }, [])

  const copyToClipboard = useCallback(() => {
    clipboard.writeText(embedUrl)
    setModalOpen(false)
  }, [ embedUrl ])

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
              <li onClick={showEmbedModal}>Share and embed</li>
              <li onClick={viewSourceCode}>View source</li>
            </MenuDiv>
          ) : null}
          <Modal
            isOpen={modalOpen}
            onBackgroundClick={() => { }}
          >
            <EmbedContainer>
              <p>Use the following URL to view/embed this UI elsewhere:</p>
              <textarea cols="4" rows="4" defaultValue={embedUrl}></textarea>
              <Button onClick={copyToClipboard}>Copy to clipboard</Button>
            </EmbedContainer>
          </Modal>
        </Container>
      )}
    </Tooltip>
  )
}

export default Menu
